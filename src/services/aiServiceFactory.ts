import { AIConfig, AIProvider, ClaudeApiBody, OllamaApiBody, OpenAIApiBody, ResumeData } from '@/types';
import { claudeOptions, ollamaOptions, openaiOptions, resumeAiConfig } from '@/config';

const RESUME_ENHANCEMENT_PROMPT = `You are a professional resume enhancement AI. Your task is to improve the given resume following these STRICT rules:

CRITICAL CONSTRAINTS:
1. Resume MUST fit on ONE page - be extremely concise
2. Remove ALL redundant or repetitive information

FORMATTING RULES:
1. Fix all spelling and grammar errors
2. Use ATS-optimized formatting with clear section headers
3. Include only: name, email, phone, location, LinkedIn profile in contact info
4. Use impactful bullet points for achievements
5. Quantify important achievements where applicable
6. Emphasize technical skills and keywords
7. Remove objective statements and verbose descriptions
8. Keep job descriptions concise (2-3 words recommended, e.g., "Full Stack Developer")

CONTENT RULES:
1. Prioritize most recent and relevant experience
2. Combine similar responsibilities into concise bullet points
3. Remove duplicated skills across categories
4. DO NOT invent or add any information not present in the original resume
5. Include military service if present (1-2 sentences max)

OUTPUT FORMAT:
Return ONLY a valid JSON object (no markdown, no code blocks) matching the ResumeData type:
- personalInfo (name, title, email, phone, location, linkedin)
- experience (array of jobs with company, location, description, title, dateRange, duties)
- education (array with institution, university, degree, field, location, dateRange)
- skills (array of skill categories with categoryTitle and skills array)
- militaryService (string, 1-2 sentences if present, empty string if not)
- projects (optional - only if highly relevant)

CRITICAL: Output ONLY valid JSON. Be concise. One page maximum.`;

const OLLAMA_STEP1_PROMPT = `Extract ONLY basic information from the resume. Output valid JSON without any markdown.

{
  "personalInfo": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string or empty"
  }
}

CRITICAL: Output ONLY valid JSON. Start with { and end with }. No other text.`;

const OLLAMA_STEP2_PROMPT = `Extract education, skills, and military service from the resume. Output valid JSON without any markdown.

{
  "education": [
    {
      "institution": "string",
      "university": "string or empty",
      "degree": "string",
      "field": "string or empty",
      "location": "string or empty",
      "dateRange": "string or -"
    }
  ],
  "skills": [
    {
      "categoryTitle": "string (e.g., Programming Languages)",
      "skills": ["skill1", "skill2", "..."]
    }
  ],
  "militaryService": "string or empty (brief description if present)"
}

RULES:
- Military service: 1-2 sentences max if present, empty string if not
- Output ONLY valid JSON. Start with { and end with }. No other text.`;

const createOllamaStep3Prompt = (): string => {
  const config = resumeAiConfig;
  let prompt = `Extract work experience from the resume. Output valid JSON without any markdown.

{
  "experience": [
    {
      "company": "string",
      "location": "string",
      "description": "brief description (2-3 words recommended)",
      "title": "string",
      "dateRange": "string",
      "duties": ["duty1", "duty2", "..."]
    }
  ]
}

CRITICAL RULES:`;

  if (config?.experience) {
    if (config.experience.maxJobs !== null && config.experience.maxJobs !== undefined) {
      prompt += `\n- Include ONLY the ${config.experience.maxJobs} most recent and relevant jobs`;
    }

    if (config.experience.bulletPointsPerJob !== null && config.experience.bulletPointsPerJob !== undefined) {
      prompt += `\n- Each job MUST have EXACTLY ${config.experience.bulletPointsPerJob} bullet points (duties)`;
    }

    if (config.experience.maxBulletLength !== null && config.experience.maxBulletLength !== undefined) {
      prompt += `\n- Each bullet point MUST be maximum ${config.experience.maxBulletLength} characters`;
    } else {
      prompt += `\n- Bullet points should be concise but comprehensive`;
    }

    if (config.experience.exclude && Array.isArray(config.experience.exclude) && config.experience.exclude.length > 0) {
      prompt += `\n- COMPLETELY SKIP jobs with these titles: ${config.experience.exclude.join(', ')}`;
    }
  }

  prompt += `\n- Keep description concise (2-3 words recommended)
- NO duplicates
- Output ONLY valid JSON. Start with { and end with }. No other text.`;

  return prompt;
};

const createValidationPrompt = (resumeData: ResumeData): string => {
  const config = resumeAiConfig;
  const hasConfig = config && Object.keys(config).length > 0;

  let validationPrompt = `You are a resume quality validator. Review the following resume data and fix any issues. Output ONLY valid JSON.

CRITICAL VALIDATION RULES:
1. Check for duplicate duties across different jobs - each duty MUST be unique
2. Ensure no two jobs have identical descriptions or bullet points
3. Remove any redundant or repetitive information
4. Verify all dates are properly formatted
5. Check that all required fields are present and valid
6. Ensure consistency in formatting and style`;

  if (hasConfig) {
    validationPrompt += `

ADDITIONAL CONFIGURATION CONSTRAINTS:`;

    if (config.experience) {
      if (config.experience.maxJobs !== null && config.experience.maxJobs !== undefined) {
        validationPrompt += `\n- Maximum ${config.experience.maxJobs} jobs in experience section`;
      }

      if (config.experience.bulletPointsPerJob !== null && config.experience.bulletPointsPerJob !== undefined) {
        validationPrompt += `\n- Maximum ${config.experience.bulletPointsPerJob} bullet points per job`;
      }

      if (config.experience.maxBulletLength !== null && config.experience.maxBulletLength !== undefined) {
        validationPrompt += `\n- STRICT: Each bullet point MUST be maximum ${config.experience.maxBulletLength} characters. Cut longer bullets.`;
      } else {
        validationPrompt += `\n- Bullet points can be any reasonable length (aim for 10-20 words)`;
      }

      if (
        config.experience.exclude &&
        Array.isArray(config.experience.exclude) &&
        config.experience.exclude.length > 0
      ) {
        validationPrompt += `\n- COMPLETELY REMOVE jobs with these titles from experience section: ${config.experience.exclude.join(', ')}`;
      }

      if (config.experience.requireActionVerbs) {
        validationPrompt += `\n- Each bullet point MUST start with a strong action verb`;
      }

      if (config.experience.avoidDuplicatePoints) {
        validationPrompt += `\n- Strictly avoid any duplicate or similar bullet points across all jobs`;
      }
    }

    if (config.skills) {
      if (config.skills.categoriesLimit !== null && config.skills.categoriesLimit !== undefined) {
        validationPrompt += `\n- Maximum ${config.skills.categoriesLimit} skill categories`;
      }

      if (config.skills.skillsPerCategory !== null && config.skills.skillsPerCategory !== undefined) {
        validationPrompt += `\n- Maximum ${config.skills.skillsPerCategory} skills per category`;
      }
    }

    if (config.education) {
      if (config.education.maxEntries !== null && config.education.maxEntries !== undefined) {
        validationPrompt += `\n- Maximum ${config.education.maxEntries} education entries`;
      }

      if (config.education.exclude && Array.isArray(config.education.exclude) && config.education.exclude.length > 0) {
        validationPrompt += `\n- COMPLETELY REMOVE education entries containing these degrees/certifications: ${config.education.exclude.join(', ')}`;
      }

      if (config.education.showDates === false) {
        validationPrompt += `\n- Remove dates from education entries (set dateRange to empty string or "-")`;
      }
    }
  }

  validationPrompt += `

BEFORE VALIDATION:
1. Count jobs in experience: should be ${config?.experience?.maxJobs || 'any'}
2. Check for excluded titles: ${config?.experience?.exclude?.join(', ') || 'none'}
3. Count bullets per job: should be ${config?.experience?.bulletPointsPerJob || 'any'}

INPUT RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

OUTPUT: Return the corrected resume data as valid JSON matching the exact ResumeData structure. Fix all issues found.`;

  return validationPrompt;
};

const extractJSON = (text: string): string => {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');

  if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
    return text.substring(braceStart, braceEnd + 1);
  }

  return text.trim();
};

const enforceResumeConstraints = (resumeData: ResumeData): ResumeData => {
  const config = resumeAiConfig;

  if (config?.experience && resumeData.experience) {
    if (config.experience.exclude && Array.isArray(config.experience.exclude) && config.experience.exclude.length > 0) {
      resumeData.experience = resumeData.experience.filter(job =>
        !config.experience.exclude?.some(excludedTitle =>
          job.title?.toLowerCase().includes(excludedTitle.toLowerCase()) ||
          job.description?.toLowerCase().includes(excludedTitle.toLowerCase())
        )
      );
    }

    const maxJobs = config.experience.maxJobs;
    if (maxJobs !== null && maxJobs !== undefined) {
      resumeData.experience = resumeData.experience.slice(0, maxJobs);
    }

    const bulletPointsPerJob = config.experience.bulletPointsPerJob;
    const maxBulletLength = config.experience.maxBulletLength;

    resumeData.experience = resumeData.experience.map(job => {
      const updatedJob = { ...job };

      if (bulletPointsPerJob !== null && bulletPointsPerJob !== undefined && job.duties) {
        updatedJob.duties = job.duties.slice(0, bulletPointsPerJob);
      }

      if (maxBulletLength !== null && maxBulletLength !== undefined && updatedJob.duties) {
        updatedJob.duties = updatedJob.duties.map(duty => {
          if (duty && duty.length > maxBulletLength) {
            return duty.substring(0, maxBulletLength - 3) + '...';
          }
          return duty;
        });
      }

      return updatedJob;
    });
  }

  if (config?.skills && resumeData.skills) {
    const categoriesLimit = config.skills.categoriesLimit;
    const skillsPerCategory = config.skills.skillsPerCategory;

    if (categoriesLimit !== null && categoriesLimit !== undefined) {
      resumeData.skills = resumeData.skills.slice(0, categoriesLimit);
    }

    if (skillsPerCategory !== null && skillsPerCategory !== undefined) {
      resumeData.skills = resumeData.skills.map(category => ({
        ...category,
        skills: category.skills ? category.skills.slice(0, skillsPerCategory) : [],
      }));
    }
  }

  if (config?.education && resumeData.education) {
    const maxEntries = config.education.maxEntries;
    if (maxEntries !== null && maxEntries !== undefined) {
      resumeData.education = resumeData.education.slice(0, maxEntries);
    }
  }

  delete resumeData.projects;

  return resumeData;
};

export const enhanceResume = async (resumeText: string, config: AIConfig): Promise<ResumeData> => {
  switch (config.provider) {
    case AIProvider.OPENAI:
    case AIProvider.CHATGPT:
      return enhanceWithOpenAI(resumeText, config);
    case AIProvider.CLAUDE:
      return enhanceWithClaude(resumeText, config);
    case AIProvider.OLLAMA:
      return enhanceWithOllama(resumeText, config);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
};

const validateResumeWithAI = async (
  resumeData: ResumeData,
  config: AIConfig,
  provider: AIProvider
): Promise<ResumeData> => {
  const validationPrompt = createValidationPrompt(resumeData);

  switch (provider) {
    case AIProvider.OPENAI:
    case AIProvider.CHATGPT: {
      const openAiBody: OpenAIApiBody = {
        model: config.model || 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a resume validation expert.' },
          { role: 'user', content: validationPrompt },
        ],
        ...openaiOptions,
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(openAiBody),
      });

      if (!response.ok) {
        throw new Error(`OpenAI validation error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = extractJSON(data.choices[0].message.content);
      return JSON.parse(content);
    }

    case AIProvider.CLAUDE: {
      const claudeBody: ClaudeApiBody = {
        model: config.model || 'claude-3-sonnet-20240229',
        messages: [
          {
            role: 'user',
            content: validationPrompt,
          },
        ],
        ...claudeOptions,
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(claudeBody),
      });

      if (!response.ok) {
        throw new Error(`Claude validation error: ${response.statusText}`);
      }

      const data = await response.json();
      const contentText = extractJSON(data.content[0].text);
      return JSON.parse(contentText);
    }

    case AIProvider.OLLAMA: {
      const endpoint = config.ollamaEndpoint || 'http://localhost:11434';
      const ollamaBody: OllamaApiBody = {
        model: config.model || 'llama2',
        prompt: validationPrompt,
        stream: false,
        format: 'json',
        options: ollamaOptions,
      };

      const response = await fetch(`${endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ollamaBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama validation error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      let jsonContent = data.response || data.thinking || data.message || data.content || '';
      jsonContent = extractJSON(jsonContent);
      return JSON.parse(jsonContent);
    }

    default:
      return resumeData;
  }
};

const enhanceWithOpenAI = async (resumeText: string, config: AIConfig): Promise<ResumeData> => {
  const openAiBody: OpenAIApiBody = {
    model: config.model || 'gpt-4',
    messages: [
      { role: 'system', content: RESUME_ENHANCEMENT_PROMPT },
      { role: 'user', content: `Original resume:\n\n${resumeText}` },
    ],
    ...openaiOptions,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(openAiBody),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = extractJSON(data.choices[0].message.content);
  let resumeData = JSON.parse(content);
  resumeData = enforceResumeConstraints(resumeData);

  resumeData = await validateResumeWithAI(resumeData, config, AIProvider.OPENAI);
  return enforceResumeConstraints(resumeData);
};

const enhanceWithClaude = async (resumeText: string, config: AIConfig): Promise<ResumeData> => {
  const claudeBody: ClaudeApiBody = {
    model: config.model || 'claude-3-sonnet-20240229',
    messages: [
      {
        role: 'user',
        content: `${RESUME_ENHANCEMENT_PROMPT}\n\nOriginal resume:\n\n${resumeText}`,
      },
    ],
    ...claudeOptions,
  };
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(claudeBody),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  const contentText = extractJSON(data.content[0].text);
  let resumeData = JSON.parse(contentText);
  resumeData = enforceResumeConstraints(resumeData);

  resumeData = await validateResumeWithAI(resumeData, config, AIProvider.CLAUDE);
  return enforceResumeConstraints(resumeData);
};

const enhanceWithOllama = async (resumeText: string, config: AIConfig): Promise<ResumeData> => {
  const endpoint = config.ollamaEndpoint || 'http://localhost:11434';

  const ollamaRequest = async (prompt: string, stepName: string): Promise<any> => {
    const ollamaBody: OllamaApiBody = {
      model: config.model || 'llama2',
      prompt: `${prompt}\n\nResume text:\n${resumeText}\n\nJSON output:`,
      stream: false,
      format: 'json',
      options: ollamaOptions,
    };

    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    let jsonContent = '';

    if (data.response && typeof data.response === 'string') {
      jsonContent = data.response;
    } else if (data.thinking && typeof data.thinking === 'string') {
      jsonContent = data.thinking;
    } else if (data.message && typeof data.message === 'string') {
      jsonContent = data.message;
    } else if (data.content && typeof data.content === 'string') {
      jsonContent = data.content;
    }

    if (!jsonContent || jsonContent.trim().length === 0) {
      console.error(`${stepName} - Empty response. Data:`, data);
      throw new Error(`Ollama returned empty response in ${stepName}`);
    }
    jsonContent = jsonContent.trim();
    const jsonStart = jsonContent.indexOf('{');
    if (jsonStart === -1) {
      console.error(`${stepName} - No JSON found:`, jsonContent.substring(0, 300));
      throw new Error(`No JSON object in ${stepName}`);
    }

    let braceCount = 0;
    let jsonEnd = -1;

    for (let i = jsonStart; i < jsonContent.length; i++) {
      if (jsonContent[i] === '{') braceCount++;
      if (jsonContent[i] === '}') braceCount--;

      if (braceCount === 0) {
        jsonEnd = i;
        break;
      }
    }

    if (jsonEnd === -1) {
      throw new Error(`Incomplete JSON in ${stepName}`);
    }

    jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error(`${stepName} - ❌ Parse failed:`, jsonContent.substring(0, 300));
      throw new Error(`${stepName} parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}`);
    }
  };

  try {
    const step1Data = await ollamaRequest(OLLAMA_STEP1_PROMPT, 'Step 1: Personal Info');
    await new Promise(resolve => setTimeout(resolve, 300));

    const step2Data = await ollamaRequest(OLLAMA_STEP2_PROMPT, 'Step 2: Education & Skills');
    await new Promise(resolve => setTimeout(resolve, 300));
    const step3Prompt = createOllamaStep3Prompt();
    const step3Data = await ollamaRequest(step3Prompt, 'Step 3: Work Experience');

    const combinedData: ResumeData = {
      personalInfo: step1Data.personalInfo || {},
      education: step2Data.education || [],
      skills: step2Data.skills || [],
      experience: step3Data.experience || [],
      projects: [],
      militaryService: step2Data.militaryService || '',
    };

    if (combinedData.experience && Array.isArray(combinedData.experience)) {
      const uniqueExperience = new Map();
      combinedData.experience.forEach((job: any) => {
        const key = `${job.company}-${job.title}-${job.dateRange}`;
        if (!uniqueExperience.has(key)) {
          uniqueExperience.set(key, job);
        }
      });
      combinedData.experience = Array.from(uniqueExperience.values());

      combinedData.experience.sort((a: any, b: any) => {
        const getYearFromRange = (dateRange: string): number => {
          if (!dateRange) return 0;
          if (dateRange.toLowerCase().includes('present')) return 9999;
          const match = dateRange.match(/(\d{4})/g);
          if (!match || match.length === 0) return 0;
          return parseInt(match[match.length - 1]);
        };

        const yearA = getYearFromRange(a.dateRange);
        const yearB = getYearFromRange(b.dateRange);
        return yearB - yearA;
      });
    }

    if (combinedData.education && Array.isArray(combinedData.education)) {
      const uniqueEducation = new Map();
      combinedData.education.forEach((edu: any) => {
        const key = `${edu.institution}-${edu.degree}-${edu.field}`;
        if (!uniqueEducation.has(key)) {
          uniqueEducation.set(key, edu);
        }
      });
      combinedData.education = Array.from(uniqueEducation.values());
    }

    if (combinedData.skills && Array.isArray(combinedData.skills)) {
      const uniqueSkills = new Map();
      combinedData.skills.forEach((skillCat: any) => {
        if (!uniqueSkills.has(skillCat.categoryTitle)) {
          uniqueSkills.set(skillCat.categoryTitle, skillCat);
        }
      });
      combinedData.skills = Array.from(uniqueSkills.values());
    }

    let finalData = enforceResumeConstraints(combinedData);

    await new Promise(resolve => setTimeout(resolve, 300));
    finalData = await validateResumeWithAI(finalData, config, AIProvider.OLLAMA);

    return enforceResumeConstraints(finalData);
  } catch (error) {
    console.error('❌ Ollama error:', error);
    throw error;
  }
};

import { AIConfig, AIProvider, ClaudeApiBody, OllamaApiBody, OpenAIApiBody, ResumeData } from '@/types';
import { claudeOptions, ollamaOptions, openaiOptions } from '@/config';

const RESUME_ENHANCEMENT_PROMPT = `You are a professional resume enhancement AI. Your task is to improve the given resume following these STRICT rules:

CRITICAL CONSTRAINTS:
1. Resume MUST fit on ONE page - be extremely concise
2. Each job duty must be ONE line maximum (50-60 characters)
3. Maximum 4-5 bullet points per job
4. Maximum 3 job positions in experience section
5. Remove ALL redundant or repetitive information

FORMATTING RULES:
1. Fix all spelling and grammar errors
2. Use ATS-optimized formatting with clear section headers
3. Include only: name, email, phone, location, LinkedIn profile in contact info
4. Use short, impactful bullet points for achievements
5. Quantify ONLY the most important achievements (not every single one)
6. Emphasize technical skills and keywords
7. Remove objective statements and verbose descriptions
8. Keep job descriptions to 2-3 words maximum (e.g., "Full Stack Developer")

CONTENT RULES:
1. Prioritize most recent and relevant experience only
2. Combine similar responsibilities into one concise bullet point
3. Remove duplicated skills across categories
4. Keep skills list focused - maximum 4-5 skills per category
5. DO NOT invent or add any information not present in the original resume
6. If experience section is too long, keep only the most recent 2-3 positions
7. Include military service if present (1-2 sentences max)

OUTPUT FORMAT:
Return ONLY a valid JSON object (no markdown, no code blocks) matching the ResumeData type:
- personalInfo (name, title, email, phone, location, linkedin)
- experience (array of jobs with company, location, description [max 3 words], title, dateRange, duties [max 5 items, each max 60 chars])
- education (array with institution, university, degree, field, location, dateRange)
- skills (array of skill categories with categoryTitle and skills array [max 5 skills per category])
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
      "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
    }
  ],
  "militaryService": "string or empty (brief description if present)"
}

RULES:
- Maximum 5 skills per category
- Maximum 7 skill categories total
- Military service: 1-2 sentences max if present, empty string if not
- Output ONLY valid JSON. Start with { and end with }. No other text.`;

const OLLAMA_STEP3_PROMPT = `Extract work experience from the resume. Be EXTREMELY concise. Output valid JSON without any markdown.

{
  "experience": [
    {
      "company": "string",
      "location": "string",
      "description": "2-3 words max",
      "title": "string",
      "dateRange": "string",
      "duties": ["duty1 (max 60 chars)", "duty2", "duty3", "duty4", "duty5"]
    }
  ]
}

CRITICAL RULES:
- Maximum 3 companies
- Maximum 5 duties per company
- Each duty maximum 60 characters
- Description maximum 3 words
- NO duplicates
- Output ONLY valid JSON. Start with { and end with }. No other text.`;

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
  const MAX_JOBS = 3;
  const MAX_DUTIES_PER_JOB = 5;
  const MAX_DUTY_LENGTH = 80;
  const MAX_SKILLS_PER_CATEGORY = 5;
  const MAX_DESCRIPTION_WORDS = 3;

  if (resumeData.experience && resumeData.experience.length > MAX_JOBS) {
    resumeData.experience = resumeData.experience.slice(0, MAX_JOBS);
  }

  if (resumeData.experience) {
    resumeData.experience = resumeData.experience.map(job => ({
      ...job,
      duties: job.duties.slice(0, MAX_DUTIES_PER_JOB).map(duty => {
        if (duty.length > MAX_DUTY_LENGTH) {
          return duty.substring(0, MAX_DUTY_LENGTH - 3) + '...';
        }
        return duty;
      }),
      description: job.description
        ? job.description.split(' ').slice(0, MAX_DESCRIPTION_WORDS).join(' ')
        : job.description,
    }));
  }

  if (resumeData.skills) {
    resumeData.skills = resumeData.skills.map(category => ({
      ...category,
      skills: category.skills.slice(0, MAX_SKILLS_PER_CATEGORY),
    }));
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
  const resumeData = JSON.parse(content);
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
  const resumeData = JSON.parse(contentText);
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
    const step3Data = await ollamaRequest(OLLAMA_STEP3_PROMPT, 'Step 3: Work Experience');

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

    const constrainedData = enforceResumeConstraints(combinedData);

    console.log('=== Generated Resume (Ollama) ===');
    console.log(constrainedData);

    return constrainedData;
  } catch (error) {
    console.error('❌ Ollama error:', error);
    throw error;
  }
};

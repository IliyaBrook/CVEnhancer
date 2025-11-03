import { AIConfig, AIProvider, ClaudeApiBody, OllamaApiBody, OpenAIApiBody, ResumeData, ResumeConfig, ParsedResumeData } from '@/types';
import { claudeOptions, ollamaOptions, openaiOptions } from '@/config';
import { loadResumeConfig } from '@/utils';
import resumeAiConfigDefault from '@/config/resume-ai-config.json';

/**
 * Get resume configuration from localStorage or fallback to default
 * This ensures user settings are always respected
 */
const getResumeConfig = (): ResumeConfig => {
  const userConfig = loadResumeConfig();
  return userConfig || (resumeAiConfigDefault as ResumeConfig);
};

// JSON Schema for structured output (OpenAI)
const RESUME_JSON_SCHEMA = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        name: { type: "string" },
        title: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" }
      },
      required: ["name", "title", "email", "phone", "location"],
      additionalProperties: false
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          location: { type: "string" },
          description: { type: "string" },
          title: { type: "string" },
          dateRange: { type: "string" },
          duties: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["company", "location", "title", "dateRange", "duties"],
        additionalProperties: false
      }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          university: { type: "string" },
          degree: { type: "string" },
          field: { type: "string" },
          location: { type: "string" },
          dateRange: { type: "string" }
        },
        required: ["institution", "university", "degree", "location", "dateRange"],
        additionalProperties: false
      }
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          categoryTitle: { type: "string" },
          skills: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["categoryTitle", "skills"],
        additionalProperties: false
      }
    },
    militaryService: { type: "string" }
  },
  required: ["personalInfo", "experience", "education", "skills", "militaryService"],
  additionalProperties: false
};

const createResumeEnhancementPrompt = (jobTitle?: string): string => {
  const jobContext = jobTitle
    ? `\n<job_context>\nThe candidate's profession/job title is: ${jobTitle}\nUse this context to better understand and enhance the resume content.\n</job_context>\n`
    : '';

  return `You are a professional resume enhancement AI.

<instructions>
<critical_constraints>
- Resume MUST fit on ONE page - be extremely concise
- Remove ALL redundant or repetitive information
- CRITICAL: Extract ONLY information that exists in the provided resume
- DO NOT invent, fabricate, or add any information not present in the original resume
- DO NOT make assumptions about job duties or experience that aren't explicitly stated
- If information is missing, leave the field empty rather than inventing data
</critical_constraints>
${jobContext}
<formatting_rules>
- Fix all spelling and grammar errors
- Use ATS-optimized formatting with clear section headers
- Contact info: name, email, phone, location, LinkedIn profile only
- Use impactful bullet points for achievements
- Quantify achievements where applicable
- Emphasize relevant skills and keywords for the profession
- Remove objective statements and verbose descriptions
- Keep job descriptions concise (2-3 words based on actual role)
</formatting_rules>

<content_rules>
- Prioritize most recent and relevant experience
- Combine similar responsibilities into concise bullet points
- Remove duplicated skills across categories
- Include military service if present (1-2 sentences max, otherwise empty string)
- Respect the actual profession - do not transform a sales role into a tech role or vice versa
</content_rules>

<output_format>
Return ONLY valid JSON matching this structure:
{
  "personalInfo": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (optional)",
    "github": "string (optional)"
  },
  "experience": [{
    "company": "string",
    "location": "string",
    "description": "string (2-3 words)",
    "title": "string",
    "dateRange": "string",
    "duties": ["string"]
  }],
  "education": [{
    "institution": "string",
    "university": "string",
    "degree": "string",
    "field": "string",
    "location": "string",
    "dateRange": "string"
  }],
  "skills": [{
    "categoryTitle": "string",
    "skills": ["string"]
  }],
  "militaryService": "string (1-2 sentences or empty)"
}
</output_format>
</instructions>`;
};

const createOllamaStep1Prompt = (jobTitle?: string): string => {
  const jobContext = jobTitle
    ? `\n<job_context>\nThe candidate's profession is: ${jobTitle}\n</job_context>\n`
    : '';

  return `Extract personal information, education, and skills from the resume.

<instructions>
<rules>
- CRITICAL: Extract ONLY what exists in the resume
- DO NOT invent or fabricate any information
- Military service: 1-2 sentences max if present, otherwise empty string
- Return valid JSON only - start with { and end with }
- No markdown, no code blocks, no extra text
</rules>
${jobContext}
<output_structure>
{
  "personalInfo": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "education": [{
    "institution": "",
    "university": "",
    "degree": "",
    "field": "",
    "location": "",
    "dateRange": ""
  }],
  "skills": [{
    "categoryTitle": "",
    "skills": []
  }],
  "militaryService": ""
}
</output_structure>
</instructions>`;
};

const createOllamaStep2Prompt = (jobTitle?: string): string => {
  const config = getResumeConfig();
  const constraints: string[] = [];

  constraints.push('CRITICAL: Extract ONLY work experience that exists in the resume');
  constraints.push('DO NOT invent or fabricate any job positions or duties');

  if (config?.experience) {
    if (config.experience.maxJobs !== null && config.experience.maxJobs !== undefined) {
      constraints.push(`Include ONLY the ${config.experience.maxJobs} most recent and relevant jobs`);
    }

    if (config.experience.bulletPointsPerJob !== null && config.experience.bulletPointsPerJob !== undefined) {
      constraints.push(`Each job MUST have EXACTLY ${config.experience.bulletPointsPerJob} bullet points (duties)`);
    }

    if (config.experience.maxBulletLength !== null && config.experience.maxBulletLength !== undefined) {
      constraints.push(`Each bullet point MUST be maximum ${config.experience.maxBulletLength} characters`);
    }

    if (config.experience.exclude && Array.isArray(config.experience.exclude) && config.experience.exclude.length > 0) {
      constraints.push(`COMPLETELY SKIP jobs with these titles: ${config.experience.exclude.join(', ')}`);
    }
  }

  const jobContext = jobTitle
    ? `\n<job_context>\nThe candidate's profession is: ${jobTitle}\nExtract experience relevant to this field.\n</job_context>\n`
    : '';

  return `Extract work experience from the resume.

<instructions>
<constraints>
${constraints.map(c => `- ${c}`).join('\n')}
- Description: 2-3 words only based on actual role
- No duplicate duties
- Return valid JSON only - start with { and end with }
</constraints>
${jobContext}
<output_structure>
{
  "experience": [{
    "company": "",
    "location": "",
    "description": "",
    "title": "",
    "dateRange": "",
    "duties": []
  }]
}
</output_structure>
</instructions>`;
};

const extractJSON = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '{}';
  }

  // 1. Remove markdown code blocks
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    text = markdownMatch[1].trim();
  }

  // 2. Find properly balanced JSON object
  let braceCount = 0;
  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (startIndex === -1) {
        startIndex = i;
      }
      braceCount++;
    } else if (text[i] === '}') {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return text.substring(startIndex, endIndex + 1);
  }

  // 3. Fallback to simple search
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
    return text.substring(braceStart, braceEnd + 1);
  }

  return text.trim();
};

// Retry utility function for API calls
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  backoffMs = 1000
): Promise<Response> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Return immediately if successful
      if (response.ok) {
        return response;
      }

      // Retry on rate limit or server errors
      if (response.status === 429 || response.status >= 500) {
        if (attempt < retries) {
          const delay = backoffMs * Math.pow(2, attempt);
          console.warn(`Request failed with status ${response.status}, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // Don't retry on client errors (except 429)
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      // Only retry on network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const delay = backoffMs * Math.pow(2, attempt);
        console.warn(`Network error, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries reached');
};

const enforceResumeConstraints = (resumeData: ResumeData): ResumeData => {
  const config = getResumeConfig();

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

export const enhanceResume = async (
  parsedData: ParsedResumeData,
  config: AIConfig,
  jobTitle?: string
): Promise<ResumeData> => {
  switch (config.provider) {
    case AIProvider.OPENAI:
    case AIProvider.CHATGPT:
      return enhanceWithOpenAI(parsedData, config, jobTitle);
    case AIProvider.CLAUDE:
      return enhanceWithClaude(parsedData, config, jobTitle);
    case AIProvider.OLLAMA:
      return enhanceWithOllama(parsedData, config, jobTitle);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
};

const enhanceWithOpenAI = async (
  parsedData: ParsedResumeData,
  config: AIConfig,
  jobTitle?: string
): Promise<ResumeData> => {
  const prompt = createResumeEnhancementPrompt(jobTitle);
  const isVision = parsedData.isVisionMode;
  const resumeText = parsedData.text || '';
  const dataURLs = parsedData.dataURLs || [];

  if (isVision) {
    console.log('[OpenAI Vision] Using vision mode with', dataURLs.length, 'images');
  }

  let userContent: any;
  if (isVision && dataURLs.length > 0) {
    // Vision mode: send images
    userContent = [
      { type: 'text', text: `${prompt}\n\nAnalyze the resume image(s) and extract information.` },
      ...dataURLs.map(url => ({
        type: 'image_url',
        image_url: { url }
      }))
    ];
  } else {
    // Text mode
    userContent = `${prompt}\n\n<resume>\n${resumeText}\n</resume>`;
  }

  const openAiBody: OpenAIApiBody = {
    model: config.model || 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: 'You are a professional resume enhancement AI. Extract ONLY information from the provided resume. Do not invent or fabricate any data. Return only valid JSON matching the provided schema.'
      },
      {
        role: 'user',
        content: userContent
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume_enhancement",
        strict: true,
        schema: RESUME_JSON_SCHEMA
      }
    },
    ...openaiOptions,
  };

  const response = await fetchWithRetry(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(openAiBody),
    }
  );

  const data = await response.json();
  const content = data.choices[0].message.content;
  let resumeData = JSON.parse(content); // No need for extractJSON - always valid JSON

  return enforceResumeConstraints(resumeData);
};

const enhanceWithClaude = async (
  parsedData: ParsedResumeData,
  config: AIConfig,
  jobTitle?: string
): Promise<ResumeData> => {
  const prompt = createResumeEnhancementPrompt(jobTitle);
  const isVision = parsedData.isVisionMode;
  const resumeText = parsedData.text || '';
  const images = parsedData.images || [];

  if (isVision) {
    console.log('[Claude Vision] Using vision mode with', images.length, 'images');
  }

  let userContent: any;
  if (isVision && images.length > 0) {
    // Vision mode: send images (Claude expects base64 without prefix)
    userContent = [
      ...images.map(imageData => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: imageData
        }
      })),
      {
        type: 'text',
        text: `${prompt}\n\nAnalyze the resume image(s) and extract information.\n\nOutput valid JSON:`
      }
    ];
  } else {
    // Text mode
    userContent = `${prompt}\n\n<resume>\n${resumeText}\n</resume>\n\nOutput valid JSON:`;
  }

  const claudeBody: ClaudeApiBody = {
    model: config.model || 'claude-3-5-sonnet-20241022',
    messages: [
      {
        role: 'user',
        content: userContent
      },
      {
        role: 'assistant',
        content: '{' // Prefill to ensure JSON starts immediately
      }
    ],
    ...claudeOptions,
  };

  const response = await fetchWithRetry(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(claudeBody),
    }
  );

  const data = await response.json();
  // Add back the prefilled '{' character
  const contentText = '{' + data.content[0].text;
  let resumeData = JSON.parse(contentText);

  return enforceResumeConstraints(resumeData);
};

const enhanceWithOllama = async (
  parsedData: ParsedResumeData,
  config: AIConfig,
  jobTitle?: string
): Promise<ResumeData> => {
  const endpoint = config.ollamaEndpoint || 'http://localhost:11434';
  const isVision = parsedData.isVisionMode;
  const resumeText = parsedData.text || '';
  const images = parsedData.images || [];

  if (isVision) {
    console.log('[Ollama Vision] Using vision mode with', images.length, 'images');
  }

  // Ollama request with retry logic
  const ollamaRequest = async (prompt: string, stepName: string, retries = 2): Promise<any> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const ollamaBody: OllamaApiBody = {
          model: config.model || 'llama2',
          prompt: isVision
            ? `${prompt}\n\nAnalyze the resume image(s) and extract the information.\n\nJSON output:`
            : `${prompt}\n\n<resume>\n${resumeText}\n</resume>\n\nJSON output:`,
          stream: false,
          format: 'json',
          options: {
            ...ollamaOptions,
            temperature: attempt > 0 ? 0.3 : ollamaOptions.temperature, // Lower temperature on retry
          },
        };

        // Add images for vision models
        if (isVision && images.length > 0) {
          (ollamaBody as any).images = images;
        }

        const response = await fetch(`${endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ollamaBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const jsonContent = extractJSON(data.response || data.thinking || data.message || data.content || '');

        if (!jsonContent || jsonContent.length < 10) {
          throw new Error('Empty or invalid response');
        }

        return JSON.parse(jsonContent);

      } catch (error) {
        if (attempt === retries) {
          console.error(`${stepName} - Failed after ${retries + 1} attempts:`, error);
          throw new Error(`${stepName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        console.warn(`${stepName} - Attempt ${attempt + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
    throw new Error(`${stepName} - Max retries reached`);
  };

  try {
    // Step 1: Get personal info, education, skills, and military service
    const step1Prompt = createOllamaStep1Prompt(jobTitle);
    const step1Data = await ollamaRequest(step1Prompt, 'Step 1: Personal Info & Education');
    await new Promise(resolve => setTimeout(resolve, 300));

    // Step 2: Get work experience
    const step2Prompt = createOllamaStep2Prompt(jobTitle);
    const step2Data = await ollamaRequest(step2Prompt, 'Step 2: Work Experience');

    // Combine data
    const combinedData: ResumeData = {
      personalInfo: step1Data.personalInfo || {},
      education: step1Data.education || [],
      skills: step1Data.skills || [],
      experience: step2Data.experience || [],
      projects: [],
      militaryService: step1Data.militaryService || '',
    };

    // Deduplicate and sort experience
    if (combinedData.experience && Array.isArray(combinedData.experience)) {
      const uniqueExperience = new Map();
      combinedData.experience.forEach((job: any) => {
        const key = `${job.company}-${job.title}-${job.dateRange}`;
        if (!uniqueExperience.has(key)) {
          uniqueExperience.set(key, job);
        }
      });
      combinedData.experience = Array.from(uniqueExperience.values());

      // Sort by most recent first
      combinedData.experience.sort((a: any, b: any) => {
        const getYearFromRange = (dateRange: string): number => {
          if (!dateRange) return 0;
          if (dateRange.toLowerCase().includes('present')) return 9999;
          const match = dateRange.match(/(\d{4})/g);
          if (!match || match.length === 0) return 0;
          return parseInt(match[match.length - 1]);
        };

        return getYearFromRange(b.dateRange) - getYearFromRange(a.dateRange);
      });
    }

    // Deduplicate education
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

    // Deduplicate skills
    if (combinedData.skills && Array.isArray(combinedData.skills)) {
      const uniqueSkills = new Map();
      combinedData.skills.forEach((skillCat: any) => {
        if (!uniqueSkills.has(skillCat.categoryTitle)) {
          uniqueSkills.set(skillCat.categoryTitle, skillCat);
        }
      });
      combinedData.skills = Array.from(uniqueSkills.values());
    }

    // Apply constraints and return
    return enforceResumeConstraints(combinedData);

  } catch (error) {
    console.error('Ollama error:', error);
    throw error;
  }
};

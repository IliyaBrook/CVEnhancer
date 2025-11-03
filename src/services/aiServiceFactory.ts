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
        linkedin: {
          anyOf: [
            { type: "string" },
            { type: "null" }
          ]
        },
        github: {
          anyOf: [
            { type: "string" },
            { type: "null" }
          ]
        }
      },
      required: ["name", "title", "email", "phone", "location", "linkedin", "github"],
      additionalProperties: false
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          location: { type: "string" },
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
          field: {
            anyOf: [
              { type: "string" },
              { type: "null" }
            ]
          },
          location: { type: "string" },
          dateRange: { type: "string" }
        },
        required: ["institution", "university", "degree", "field", "location", "dateRange"],
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
  const config = getResumeConfig();
  const jobContext = jobTitle
    ? `\n<job_context>\nThe candidate's profession/job title is: ${jobTitle}\nUse this context to better understand and enhance the resume content.\n</job_context>\n`
    : '';

  // Build experience constraints
  const experienceConstraints: string[] = [];
  if (config?.experience) {
    if (config.experience.maxJobs !== null && config.experience.maxJobs !== undefined) {
      experienceConstraints.push(`Include ONLY the ${config.experience.maxJobs} most recent and relevant jobs`);
    }
    if (config.experience.bulletPointsPerJob !== null && config.experience.bulletPointsPerJob !== undefined) {
      experienceConstraints.push(`Each job MUST have EXACTLY ${config.experience.bulletPointsPerJob} bullet points (duties)`);
    }
    if (config.experience.maxBulletLength !== null && config.experience.maxBulletLength !== undefined) {
      experienceConstraints.push(`CRITICAL: Each bullet point MUST be maximum ${config.experience.maxBulletLength} characters. DO NOT EXCEED THIS LIMIT.`);
    } else {
      experienceConstraints.push(`IMPORTANT: Write full, detailed bullet points. DO NOT truncate or abbreviate unless necessary.`);
    }
    if (config.experience.requireActionVerbs) {
      experienceConstraints.push(`REQUIRED: Start each bullet point with a strong action verb (e.g., "Developed", "Implemented", "Managed", "Led")`);
    }
    if (config.experience.metricsLevel) {
      const metricsInstructions = {
        low: 'Include metrics and numbers if they are readily available in the resume',
        moderate: 'Actively look for and include quantifiable metrics and achievements (percentages, numbers, sizes, etc.)',
        high: 'PRIORITIZE quantifiable metrics in every bullet point where possible. Extract all numbers, percentages, team sizes, and measurable impacts.'
      };
      experienceConstraints.push(metricsInstructions[config.experience.metricsLevel]);
    }
    if (config.experience.exclude && Array.isArray(config.experience.exclude) && config.experience.exclude.length > 0) {
      experienceConstraints.push(`COMPLETELY SKIP jobs with these titles: ${config.experience.exclude.join(', ')}`);
    }
    if (config.experience.avoidDuplicatePoints) {
      experienceConstraints.push(`Avoid duplicate or very similar bullet points across different jobs`);
    }
  }

  // Build skills constraints
  const skillsConstraints: string[] = [];
  if (config?.skills) {
    if (config.skills.categoriesLimit !== null && config.skills.categoriesLimit !== undefined) {
      skillsConstraints.push(`Include up to ${config.skills.categoriesLimit} skill categories`);
    }
    if (config.skills.skillsPerCategory !== null && config.skills.skillsPerCategory !== undefined) {
      skillsConstraints.push(`Each category should have up to ${config.skills.skillsPerCategory} skills`);
    }
  }

  // Build education constraints
  const educationConstraints: string[] = [];
  if (config?.education) {
    if (config.education.maxEntries !== null && config.education.maxEntries !== undefined) {
      educationConstraints.push(`Include ONLY the ${config.education.maxEntries} most relevant education entries`);
    }
    if (config.education.exclude && Array.isArray(config.education.exclude) && config.education.exclude.length > 0) {
      educationConstraints.push(`COMPLETELY SKIP education entries containing: ${config.education.exclude.join(', ')}`);
    }
  }

  return `You are a professional resume enhancement AI.

<instructions>
<critical_constraints>
- CRITICAL: Extract ONLY information that exists in the provided resume
- DO NOT invent, fabricate, or add any information not present in the original resume
- DO NOT make assumptions about job duties or experience that aren't explicitly stated
- If information is missing, leave the field empty rather than inventing data
- PRESERVE all important information - better to include more detail than to truncate
- DO NOT sacrifice important content for brevity
</critical_constraints>
${jobContext}
<experience_requirements>
${experienceConstraints.map(c => `- ${c}`).join('\n')}
</experience_requirements>

<skills_requirements>
${skillsConstraints.length > 0 ? skillsConstraints.map(c => `- ${c}`).join('\n') : '- Extract all relevant skills from the resume'}
- Remove duplicated skills across categories
- Group skills logically by category (e.g., "Programming Languages", "Frameworks", "Tools")
</skills_requirements>

<education_requirements>
${educationConstraints.length > 0 ? educationConstraints.map(c => `- ${c}`).join('\n') : '- Extract all education information from the resume'}
- Prioritize most recent and relevant education
- Include degree, field of study, institution, and location
</education_requirements>

<formatting_rules>
- Fix all spelling and grammar errors
- Use ATS-optimized formatting with clear section headers
- Contact info: name, email, phone, location, LinkedIn profile only
- Use impactful bullet points for achievements
- Emphasize relevant skills and keywords for the profession
- Remove objective statements and verbose descriptions
</formatting_rules>

<content_rules>
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
    "linkedin": "string or null (use null if not found)",
    "github": "string or null (use null if not found)"
  },
  "experience": [{
    "company": "string",
    "location": "string",
    "title": "string",
    "dateRange": "string",
    "duties": ["string"]
  }],
  "education": [{
    "institution": "string",
    "university": "string",
    "degree": "string",
    "field": "string or null (use null if not found)",
    "location": "string",
    "dateRange": "string"
  }],
  "skills": [{
    "categoryTitle": "string",
    "skills": ["string"]
  }],
  "militaryService": "string (1-2 sentences or empty)"
}

IMPORTANT: Use null for optional fields (linkedin, github, field) if they are not found in the resume.
</output_format>
</instructions>`;
};

const createOllamaStep1Prompt = (jobTitle?: string): string => {
  const config = getResumeConfig();
  const jobContext = jobTitle
    ? `\n<job_context>\nThe candidate's profession is: ${jobTitle}\n</job_context>\n`
    : '';

  const constraints: string[] = [
    'CRITICAL: Extract ONLY what exists in the resume',
    'DO NOT invent or fabricate any information',
    'PRESERVE all information - do NOT truncate or abbreviate',
    'Military service: 1-2 sentences max if present, otherwise empty string',
    'Return valid JSON only - start with { and end with }',
    'No markdown, no code blocks, no extra text'
  ];

  // Add skills constraints if configured
  if (config?.skills) {
    if (config.skills.categoriesLimit !== null && config.skills.categoriesLimit !== undefined) {
      constraints.push(`Include up to ${config.skills.categoriesLimit} skill categories`);
    }
    if (config.skills.skillsPerCategory !== null && config.skills.skillsPerCategory !== undefined) {
      constraints.push(`Each category should have up to ${config.skills.skillsPerCategory} skills`);
    }
  }

  // Add education constraints if configured
  if (config?.education) {
    if (config.education.maxEntries !== null && config.education.maxEntries !== undefined) {
      constraints.push(`Include ONLY the ${config.education.maxEntries} most relevant education entries`);
    }
    if (config.education.exclude && Array.isArray(config.education.exclude) && config.education.exclude.length > 0) {
      constraints.push(`COMPLETELY SKIP education entries containing: ${config.education.exclude.join(', ')}`);
    }
  }

  return `Extract personal information, education, and skills from the resume. Follow all rules strictly.

<instructions>
<rules>
${constraints.map(c => `- ${c}`).join('\n')}
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

IMPORTANT: Follow ALL rules above strictly. Do not skip or ignore any requirements.
</instructions>`;
};

const createOllamaStep2Prompt = (jobTitle?: string): string => {
  const config = getResumeConfig();
  const constraints: string[] = [];

  constraints.push('CRITICAL: Extract ONLY work experience that exists in the resume');
  constraints.push('DO NOT invent or fabricate any job positions or duties');
  constraints.push('PRESERVE all important information - do NOT truncate or abbreviate text');

  if (config?.experience) {
    if (config.experience.maxJobs !== null && config.experience.maxJobs !== undefined) {
      constraints.push(`Include ONLY the ${config.experience.maxJobs} most recent and relevant jobs`);
    }

    if (config.experience.bulletPointsPerJob !== null && config.experience.bulletPointsPerJob !== undefined) {
      constraints.push(`CRITICAL: Each job MUST have EXACTLY ${config.experience.bulletPointsPerJob} bullet points (duties). This is a STRICT requirement.`);
    }

    if (config.experience.maxBulletLength !== null && config.experience.maxBulletLength !== undefined) {
      constraints.push(`CRITICAL: Each bullet point MUST be maximum ${config.experience.maxBulletLength} characters. DO NOT EXCEED THIS LIMIT.`);
    } else {
      constraints.push(`IMPORTANT: Write full, complete bullet points. DO NOT truncate or abbreviate. Better to be detailed than brief.`);
    }

    if (config.experience.requireActionVerbs) {
      constraints.push(`REQUIRED: Start each bullet point with a strong action verb (e.g., "Developed", "Implemented", "Managed", "Led")`);
    }

    if (config.experience.metricsLevel) {
      const metricsInstructions = {
        low: 'Include metrics and numbers if they are readily available',
        moderate: 'Actively look for and include quantifiable metrics (percentages, numbers, sizes)',
        high: 'PRIORITIZE quantifiable metrics in every bullet point. Extract all numbers, percentages, team sizes, and measurable impacts.'
      };
      constraints.push(metricsInstructions[config.experience.metricsLevel]);
    }

    if (config.experience.avoidDuplicatePoints) {
      constraints.push(`Avoid duplicate or very similar duties across different jobs`);
    }

    if (config.experience.exclude && Array.isArray(config.experience.exclude) && config.experience.exclude.length > 0) {
      constraints.push(`COMPLETELY SKIP jobs with these titles: ${config.experience.exclude.join(', ')}`);
    }
  }

  const jobContext = jobTitle
    ? `\n<job_context>\nThe candidate's profession is: ${jobTitle}\nExtract experience relevant to this field.\n</job_context>\n`
    : '';

  return `Extract work experience from the resume. Pay close attention to all constraints.

<instructions>
<constraints>
${constraints.map(c => `- ${c}`).join('\n')}
- Return valid JSON only - start with { and end with }
</constraints>
${jobContext}
<output_structure>
{
  "experience": [{
    "company": "",
    "location": "",
    "title": "",
    "dateRange": "",
    "duties": []
  }]
}
</output_structure>

IMPORTANT: Follow ALL constraints above strictly. Do not skip or ignore any requirements.
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
    // Filter out excluded jobs
    if (config.experience.exclude && Array.isArray(config.experience.exclude) && config.experience.exclude.length > 0) {
      resumeData.experience = resumeData.experience.filter(job =>
        !config.experience.exclude?.some(excludedTitle =>
          job.title?.toLowerCase().includes(excludedTitle.toLowerCase())
        )
      );
    }

    // Limit number of jobs (as fallback, model should already respect this)
    const maxJobs = config.experience.maxJobs;
    if (maxJobs !== null && maxJobs !== undefined) {
      resumeData.experience = resumeData.experience.slice(0, maxJobs);
    }

    // Limit bullet points per job (as fallback, model should already respect this)
    const bulletPointsPerJob = config.experience.bulletPointsPerJob;
    if (bulletPointsPerJob !== null && bulletPointsPerJob !== undefined) {
      resumeData.experience = resumeData.experience.map(job => ({
        ...job,
        duties: job.duties ? job.duties.slice(0, bulletPointsPerJob) : []
      }));
    }

    // REMOVED: Hard truncation with "..." - model should respect maxBulletLength in prompts
    // This allows models to create proper content within the character limit
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
    // Filter out excluded education entries
    if (config.education.exclude && Array.isArray(config.education.exclude) && config.education.exclude.length > 0) {
      resumeData.education = resumeData.education.filter(edu =>
        !config.education.exclude?.some(excludedTerm =>
          edu.institution?.toLowerCase().includes(excludedTerm.toLowerCase()) ||
          edu.degree?.toLowerCase().includes(excludedTerm.toLowerCase()) ||
          edu.field?.toLowerCase().includes(excludedTerm.toLowerCase())
        )
      );
    }

    // Limit number of education entries (as fallback, model should already respect this)
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
    model: config.models?.openai || 'gpt-4o-2024-08-06',
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
    '/api/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKeys?.openai}`,
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
    model: config.models?.claude || 'claude-3-5-sonnet-20241022',
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
    '/api/anthropic/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKeys?.claude!,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
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

  // Determine if we need to split Step 2 based on text length
  // If resume is very long, split experience extraction into multiple requests
  const shouldSplitStep2 = resumeText.length > 8000 && !isVision;
  if (shouldSplitStep2) {
    console.log('[Ollama] Large resume detected, will split experience extraction into multiple requests');
  }

  // Ollama request with retry logic
  const ollamaRequest = async (
    prompt: string,
    stepName: string,
    contextText?: string,
    retries = 2
  ): Promise<any> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const ollamaBody: OllamaApiBody = {
          model: config.models?.ollama || 'llama2',
          prompt: isVision
            ? `${prompt}\n\nAnalyze the resume image(s) and extract the information.\n\nJSON output:`
            : `${prompt}\n\n<resume>\n${contextText || resumeText}\n</resume>\n\nJSON output:`,
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

    let allExperience: any[] = [];

    if (shouldSplitStep2 && !isVision) {
      // Split resume text into chunks for experience extraction
      // Try to split by common section delimiters
      const lines = resumeText.split('\n');
      const chunks: string[] = [];
      let currentChunk = '';
      let chunkSize = 0;
      const maxChunkSize = 4000; // Characters per chunk

      for (const line of lines) {
        if (chunkSize + line.length > maxChunkSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = line + '\n';
          chunkSize = line.length;
        } else {
          currentChunk += line + '\n';
          chunkSize += line.length;
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      console.log(`[Ollama] Split resume into ${chunks.length} chunks for experience extraction`);

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const step2Prompt = createOllamaStep2Prompt(jobTitle);
        const chunkData = await ollamaRequest(
          step2Prompt,
          `Step 2.${i + 1}: Work Experience (chunk ${i + 1}/${chunks.length})`,
          chunks[i]
        );

        if (chunkData.experience && Array.isArray(chunkData.experience)) {
          allExperience.push(...chunkData.experience);
        }

        // Delay between chunks to avoid overwhelming the model
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    } else {
      // Standard single request for experience
      const step2Prompt = createOllamaStep2Prompt(jobTitle);
      const step2Data = await ollamaRequest(step2Prompt, 'Step 2: Work Experience');
      allExperience = step2Data.experience || [];
    }

    // Combine data
    const combinedData: ResumeData = {
      personalInfo: step1Data.personalInfo || {},
      education: step1Data.education || [],
      skills: step1Data.skills || [],
      experience: allExperience,
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

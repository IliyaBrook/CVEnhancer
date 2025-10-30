import type { AIConfig, ResumeData } from '../types';
import { AIProvider } from '../types';

const RESUME_ENHANCEMENT_PROMPT = `You are a professional resume enhancement AI. Your task is to improve the given resume following these strict rules:

1. Fix all spelling and grammar errors
2. Use ATS-optimized formatting with clear section headers
3. Include only: name, email, phone, location, LinkedIn profile in contact info
4. Use bullet points for achievements and responsibilities
5. Quantify achievements with numbers and metrics wherever possible
6. Emphasize technical skills and keywords
7. Remove objective statements
8. Ensure required sections: Education, Experience, Skills, Projects
9. DO NOT invent or add any information not present in the original resume
10. Maintain professional tone and perfect grammar

Return the enhanced resume as a structured JSON object matching the ResumeData type with these fields:
- personalInfo (name, title, email, phone, location, linkedin)
- experience (array of jobs with company, location, description, title, dateRange, duties)
- education (array with institution, degree, fieldOfStudy, location, date)
- skills (array of skill categories with title and skills array)
- projects (optional array)
- certifications (optional array of strings)

IMPORTANT: Only use information from the original resume. Do not add skills, experiences, or details that are not explicitly mentioned.`;

export const enhanceResume = async (
  resumeText: string,
  config: AIConfig
): Promise<ResumeData> => {
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

const enhanceWithOpenAI = async (
  resumeText: string,
  config: AIConfig
): Promise<ResumeData> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4',
      messages: [
        { role: 'system', content: RESUME_ENHANCEMENT_PROMPT },
        { role: 'user', content: `Original resume:\n\n${resumeText}` }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

const enhanceWithClaude = async (
  resumeText: string,
  config: AIConfig
): Promise<ResumeData> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `${RESUME_ENHANCEMENT_PROMPT}\n\nOriginal resume:\n\n${resumeText}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  const contentText = data.content[0].text;
  return JSON.parse(contentText);
};

const enhanceWithOllama = async (
  resumeText: string,
  config: AIConfig
): Promise<ResumeData> => {
  const endpoint = config.ollamaEndpoint || 'http://localhost:11434';
  
  const response = await fetch(`${endpoint}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model || 'llama2',
      prompt: `${RESUME_ENHANCEMENT_PROMPT}\n\nOriginal resume:\n\n${resumeText}`,
      stream: false,
      format: 'json'
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.response);
};
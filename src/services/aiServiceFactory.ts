import { AIProvider, AIConfig, ResumeData } from '@/types';

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

Return ONLY a valid JSON object (no markdown, no code blocks) matching the ResumeData type with these fields:
- personalInfo (name, title, email, phone, location, linkedin)
- experience (array of jobs with company, location, description, title, dateRange, duties)
- education (array with institution, university, degree, field, location, dateRange)
- skills (array of skill categories with title, categoryTitle, and skills array)
- projects (optional array)
- certifications (optional array of strings)

IMPORTANT: Only use information from the original resume. Do not add skills, experiences, or details that are not explicitly mentioned.
Output ONLY valid JSON without any markdown formatting or code blocks.`;

const OLLAMA_JSON_PROMPT = `You MUST respond with ONLY valid JSON. Do not include any explanations, markdown, or text before or after the JSON object.

Parse the resume and output a JSON object with this exact structure:
{
  "personalInfo": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (optional)"
  },
  "experience": [
    {
      "company": "string",
      "location": "string",
      "description": "string (optional)",
      "title": "string",
      "dateRange": "string",
      "duties": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "university": "string",
      "degree": "string",
      "field": "string",
      "location": "string",
      "dateRange": "string"
    }
  ],
  "skills": [
    {
      "categoryTitle": "string",
      "skills": ["string"]
    }
  ],
  "projects": [],
  "certifications": ["string"]
}

CRITICAL RULES:
1. Extract information from the resume below. Use ONLY information present in the resume.
2. Do NOT invent details.
3. Do NOT duplicate entries - each company should appear ONLY ONCE in the experience array.
4. Do NOT repeat the same job position multiple times.
5. Combine all duties from the same company/position into a single entry.
6. Start your response with { and end with }. No other text.`;

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
	    temperature: config.temperature,
	    top_p: config.topOp,
	    max_tokens: config.maxTokens,
	    stop: config.stopGeneration,
	    response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = extractJSON(data.choices[0].message.content);
  return JSON.parse(content);
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
	    max_tokens: config.maxTokens,
	    temperature: config.temperature,
	    top_p: config.topOp,
	    stop_sequences: config.stopGeneration,
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
  const contentText = extractJSON(data.content[0].text);
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
      prompt: `${OLLAMA_JSON_PROMPT}\n\nResume text:\n${resumeText}\n\nJSON output:`,
      stream: false,
      format: 'json',
	    options: {
		    temperature: config.temperature,
		    top_p: config.topOp,
		    num_predict: config.maxTokens,
		    stop: config.stopGeneration
	    }
    })
  });
	
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.response) {
    console.error('Ollama API response:', data);
    throw new Error('Ollama API returned empty response');
  }
  
  console.log('Ollama raw response (first 500 chars):', data.response.substring(0, 500));
  
  let jsonContent = data.response.trim();
  const jsonStart = jsonContent.indexOf('{');
  const jsonEnd = jsonContent.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('No JSON object found in response:', jsonContent);
    throw new Error('Ollama response does not contain valid JSON object');
  }
  
  jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
	
	try {
		const parsedData = JSON.parse(jsonContent);
		if (parsedData.experience && Array.isArray(parsedData.experience)) {
			const uniqueExperience = new Map();
			parsedData.experience.forEach((job: any) => {
				const key = `${job.company}-${job.title}-${job.dateRange}`;
				if (!uniqueExperience.has(key)) {
					uniqueExperience.set(key, job);
				}
			});
			parsedData.experience = Array.from(uniqueExperience.values());
		}
		
		return parsedData;
	} catch (parseError) {
		console.error('Failed to parse JSON:', jsonContent);
		console.error('Parse error:', parseError);
		throw new Error(`Failed to parse Ollama response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
	}
};
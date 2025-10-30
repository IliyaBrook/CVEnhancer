export enum AIProvider {
  OPENAI = 'openai',
  CHATGPT = 'chatgpt',
  CLAUDE = 'claude',
  OLLAMA = 'ollama',
}

export interface AIConfig {
  provider: AIProvider
  apiKey?: string
  ollamaEndpoint?: string
  model?: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: SkillCategory[]
  certifications?: string[]
  projects?: Project[]
}

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
}

export interface Experience {
  company: string
  location: string
  description?: string
  title: string
  dateRange: string
  duties: string[]
}

export interface Education {
  institution: string
  university: string
  degree: string
  field?: string
  location: string
  dateRange: string
}

export interface SkillCategory {
  title: string
  categoryTitle: string
  skills: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string
}

export type ProcessingStatus = 'idle' | 'uploading' | 'parsing' | 'enhancing' | 'completed' | 'error'

export type SupportedFileType = 'pdf' | 'docx' | 'jpeg' | 'png'

export interface FileValidationResult {
  isValid: boolean
  error?: string
  errorMessage?: string
  fileType?: SupportedFileType
}
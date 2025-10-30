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
  ollamaModel?: string
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
  university: string
  degree: string
  field?: string
  location: string
  dateRange: string
}

export interface SkillCategory {
  categoryTitle: string
  skills: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  link?: string
}

export interface ProcessingStatus {
  isProcessing: boolean
  progress: number
  message: string
  error?: string
}

export type SupportedFileType = 'pdf' | 'docx' | 'jpeg' | 'png'

export interface FileValidationResult {
  isValid: boolean
  errorMessage?: string
  fileType?: SupportedFileType
}
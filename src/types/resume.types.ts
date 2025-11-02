export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects?: Project[];
  militaryService?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  company: string;
  location: string;
  description?: string;
  title: string;
  dateRange: string;
  duties: string[];
}

export interface Education {
  institution: string;
  university: string;
  degree: string;
  field?: string;
  location: string;
  dateRange: string;
}

export interface SkillCategory {
  categoryTitle: string;
  skills: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

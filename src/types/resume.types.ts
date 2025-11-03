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

export interface ResumeConfig {
  experience: {
    maxJobs: number;
    bulletPointsPerJob: number;
    maxBulletLength: number | null;
    requireActionVerbs: boolean;
    metricsLevel: 'low' | 'moderate' | 'high';
    exclude: string[];
    avoidDuplicatePoints: boolean;
  };
  skills: {
    categoriesLimit: number;
    skillsPerCategory: number;
  };
  education: {
    maxEntries: number;
    exclude: string[];
    showDates: boolean;
    placement: 'main-content' | 'sidebar';
  };
  pdf: {
    singlePageExport: boolean;
  };
}

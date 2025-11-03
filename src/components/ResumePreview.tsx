import React from 'react';
import type { ResumeData } from '@/types';
import { resumePdfStyles as styles } from '@/styles';
import { stylesToCss } from '@/utils';

interface ResumePreviewProps {
  resumeData: ResumeData | null;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  if (!resumeData) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-200">
          <div className="p-2.5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Resume Preview
          </h2>
        </div>
        <div className="py-16 text-center">
          <div className="mb-6 inline-flex p-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">Upload and process a resume to see the preview</p>
          <p className="text-gray-400 text-sm mt-2">AI-enhanced formatting will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-200">
        <div className="p-2.5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Resume Preview
        </h2>
      </div>

      <style>{`
        .resume-container { ${stylesToCss(styles.page)} hyphens: none; }
        .main-content { ${stylesToCss(styles.mainContent)} }
        .sidebar { ${stylesToCss(styles.sidebar)} }
        .header { ${stylesToCss(styles.header)} }
        .name { ${stylesToCss(styles.name)} }
        .title { ${stylesToCss(styles.title)} }
        .section-title { ${stylesToCss(styles.sectionTitle)} }
        .section-title-with-margin { ${stylesToCss(styles.sectionTitleWithMargin)} }
        
        .job { ${stylesToCss(styles.job)} }
        .last-job-element { ${stylesToCss(styles.lastJobElement)} }
        .company-info { ${stylesToCss(styles.companyInfo)} }
        .company-name { ${stylesToCss(styles.companyName)} display: inline; }
        .location { ${stylesToCss(styles.location)} display: inline; }
        .job-title-line { display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .job-title { ${stylesToCss(styles.jobTitle)} }
        .date-range { ${stylesToCss(styles.dateRange)} }
        
        .job-duties { ${stylesToCss(styles.jobDutiesList)} }
        
        .job-duties li { ${stylesToCss(styles.jobDutyLi)} }
        
        .job-duties li::before {
          content: "•";
          position: absolute;
          left: 0;
          top: 0;
          color: #1a4d8f;
          font-weight: bold;
        }
        
        .sidebar-section { ${stylesToCss(styles.sidebarSection)} }
        .sidebar-contact-section { ${stylesToCss(styles.sidebarContactSection)} }
        
        .contact-info { ${stylesToCss(styles.contactInfoList)} }
        .contact-info li { ${stylesToCss(styles.contactInfo)} }
        
        .skill-category { ${stylesToCss(styles.skillCategory)} }
        .skill-category-title { ${stylesToCss(styles.skillCategoryTitle)} }
        
        .skill-list { ${stylesToCss(styles.skillList)} }
        
        .skill-list li { ${stylesToCss(styles.skillItemLi)} }
        
        .skill-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #666;
        }
        .education-section-title { ${stylesToCss(styles.educationSectionTitle)} }
        .education-item { ${stylesToCss(styles.educationItem)} }
        .university { ${stylesToCss(styles.university)} }
        .degree { ${stylesToCss(styles.degree)} }
        .education-location { ${stylesToCss(styles.educationLocation)} }
        .education-date { ${stylesToCss(styles.educationDate)} }
        
        .military-section { ${stylesToCss(styles.militarySection)} }
        .military-section-title { ${stylesToCss(styles.militarySectionTitle)} }
        .military-text { ${stylesToCss(styles.militaryText)} }
      `}</style>

      <div className="resume-container">
        <div className="main-content">
          <div className="header">
            <h1 className="name">{resumeData.personalInfo.name}</h1>
            {resumeData.personalInfo.title && <div className="title">{resumeData.personalInfo.title}</div>}
          </div>

          {resumeData.experience && resumeData.experience.length > 0 && (
            <>
              <div className="section-title">WORK EXPERIENCE</div>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className={resumeData.experience.length - 1 === idx ? 'job last-job-element' : 'job'}>
                  <div className="company-info">
                    <span className="company-name">{exp.company}</span>
                    {exp.location && (
                      <>
                        , <span className="location">{exp.location}</span>
                      </>
                    )}
                  </div>
                  <div className="job-title-line">
                    <span className="job-title">{exp.title}</span>
                    <span className="date-range">{exp.dateRange}</span>
                  </div>
                  {exp.duties && exp.duties.length > 0 && (
                    <ul className="job-duties">
                      {exp.duties.map((duty, i) => (
                        <li key={i}>{duty}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {resumeData.education && resumeData.education.length > 0 && (
            <>
              <div className="section-title education-section-title">EDUCATION</div>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="education-item">
                  <div className="university">{edu.university || edu.institution}</div>
                  {edu.degree && <div className="degree">{edu.degree}</div>}
                  {edu.field && <div className="degree">{edu.field}</div>}
                  {edu.location && <div className="education-location">{edu.location}</div>}
                  {edu.dateRange && edu.dateRange !== '-' && <div className="education-date">{edu.dateRange}</div>}
                </div>
              ))}
            </>
          )}

          {resumeData.militaryService && resumeData.militaryService.trim().length > 0 && (
            <div className="military-section">
              <div className="section-title military-section-title">MILITARY SERVICE</div>
              <div className="military-text">{resumeData.militaryService}</div>
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="sidebar-contact-section">
            <div className="section-title">CONTACT</div>
            <ul className="contact-info">
              {resumeData.personalInfo.location && <li>{resumeData.personalInfo.location}</li>}
              {resumeData.personalInfo.phone && <li>{resumeData.personalInfo.phone}</li>}
              {resumeData.personalInfo.email && <li>{resumeData.personalInfo.email}</li>}
              {resumeData.personalInfo.linkedin && <li>{resumeData.personalInfo.linkedin}</li>}
            </ul>
          </div>

          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="sidebar-section">
              <div className="section-title-with-margin">SKILLS</div>
              {resumeData.skills.map((category, idx) => (
                <div key={idx} className="skill-category">
                  <div className="skill-category-title">{category.categoryTitle}</div>
                  <ul className="skill-list">
                    {category.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

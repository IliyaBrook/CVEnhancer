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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Preview</h2>
        <p className="text-gray-500 text-center py-12">
          Upload and process a resume to see the preview
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Preview</h2>
      
      <style>{`
        .resume-container { ${stylesToCss(styles.page)} }
        .main-content { ${stylesToCss(styles.mainContent)} }
        .sidebar { ${stylesToCss(styles.sidebar)} }
        .header { ${stylesToCss(styles.header)} }
        .name { ${stylesToCss(styles.name)} }
        .title { ${stylesToCss(styles.titleText)} }
        .section-title { ${stylesToCss(styles.sectionTitle)} }
        .section-title:first-child { ${stylesToCss(styles.sectionTitleFirst)} }
        
        .job { ${stylesToCss(styles.job)} }
        .company-info { ${stylesToCss(styles.companyInfo)} }
        .company-name { ${stylesToCss(styles.companyName)} display: inline; }
        .location { ${stylesToCss(styles.location)} display: inline; }
        .company-description { ${stylesToCss(styles.companyDescription)} }
        .job-title-line { ${stylesToCss(styles.jobTitleLine)} align-items: center; }
        .job-title { ${stylesToCss(styles.jobTitle)} }
        .date-range { ${stylesToCss(styles.dateRange)} }
        
        .job-duties { ${stylesToCss(styles.jobDutiesList)} }
        
        .job-duties li {
          position: relative;
          padding-left: 15px;
          ${stylesToCss(styles.jobDuty)}
        }
        
        .job-duties li::before {
          content: "•";
          ${stylesToCss(styles.bullet)}
          position: absolute;
          left: 0;
          top: 0;
        }
        
        .sidebar-section { ${stylesToCss(styles.sidebarSection)} }
        
        .sidebar .section-title {
          ${stylesToCss(styles.sidebarSectionTitle)}
          margin-top: 0;
        }
        
        .sidebar .section-title:not(:first-child) {
          margin-top: 25px;
        }
        
        .contact-info { ${stylesToCss(styles.contactInfoList)} }
        .contact-info li { ${stylesToCss(styles.contactInfo)} }
        
        .skill-category { ${stylesToCss(styles.skillCategory)} }
        .skill-category-title { ${stylesToCss(styles.skillCategoryTitle)} }
        
        .skill-list { ${stylesToCss(styles.skillList)} }
        
        .skill-list li {
          ${stylesToCss(styles.skillItem)}
          position: relative;
          padding-left: 10px;
        }
        
        .skill-list li::before {
          content: "•";
          ${stylesToCss(styles.skillBullet)}
          position: absolute;
          left: 0;
        }
        
        .education-item { ${stylesToCss(styles.educationItem)} }
        .university { ${stylesToCss(styles.university)} }
        .degree { ${stylesToCss(styles.degree)} }
        .education-location { ${stylesToCss(styles.educationLocation)} }
        .education-date { ${stylesToCss(styles.educationDate)} }
      `}</style>

      <div className="resume-container">
        <div className="main-content">
          <div className="header">
            <h1 className="name">{resumeData.personalInfo.name}</h1>
            {resumeData.personalInfo.title && (
              <div className="title">{resumeData.personalInfo.title}</div>
            )}
          </div>

          {resumeData.experience && resumeData.experience.length > 0 && (
            <>
              <div className="section-title">WORK EXPERIENCE</div>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="job">
                  <div className="company-info">
                    <span className="company-name">{exp.company}</span>
                    {exp.location && <>, <span className="location">{exp.location}</span></>}
                  </div>
                  {exp.description && (
                    <div className="company-description">{exp.description}</div>
                  )}
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

        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <div className="section-title">CONTACT</div>
            <ul className="contact-info">
              {resumeData.personalInfo.location && (
                <li>{resumeData.personalInfo.location}</li>
              )}
              {resumeData.personalInfo.phone && (
                <li>{resumeData.personalInfo.phone}</li>
              )}
              {resumeData.personalInfo.email && (
                <li>{resumeData.personalInfo.email}</li>
              )}
              {resumeData.personalInfo.linkedin && (
                <li>{resumeData.personalInfo.linkedin}</li>
              )}
            </ul>
          </div>

          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="sidebar-section">
              <div className="section-title">SKILLS</div>
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

          {resumeData.education && resumeData.education.length > 0 && (
            <div className="sidebar-section">
              <div className="section-title">EDUCATION</div>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="education-item">
                  <div className="university">{edu.university || edu.institution}</div>
                  {edu.degree && <div className="degree">{edu.degree}</div>}
                  {edu.field && <div className="degree">{edu.field}</div>}
                  {edu.location && <div className="education-location">{edu.location}</div>}
                  {edu.dateRange && <div className="education-date">{edu.dateRange}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
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
        
        .job {
          margin-bottom: 20px;
        }
        
        .company-info {
          margin-bottom: 8px;
        }
        
        .company-name {
          font-weight: bold;
          color: #333;
          display: inline;
        }
        
        .location {
          color: #666;
          font-style: italic;
          display: inline;
        }
        
        .company-description {
          color: #666;
          font-style: italic;
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        .job-title-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .job-title {
          font-weight: bold;
          color: #333;
        }
        
        .date-range {
          color: #666;
          font-size: 14px;
        }
        
        .job-duties {
          list-style: none;
          padding-left: 0;
        }
        
        .job-duties li {
          position: relative;
          padding-left: 15px;
          margin-bottom: 5px;
          color: #333;
          line-height: 1.35;
          font-size: 14px;
        }
        
        .job-duties li::before {
          content: "•";
          color: #1a4d8f;
          position: absolute;
          left: 0;
          top: 0;
          font-weight: bold;
        }
        
        .sidebar-section {
          margin-bottom: 25px;
        }
        
        .sidebar .section-title {
          font-size: 13px;
          color: #1a4d8f;
          margin-bottom: 12px;
          margin-top: 0;
        }
        
        .sidebar .section-title:not(:first-child) {
          margin-top: 25px;
        }
        
        .contact-info {
          list-style: none;
        }
        
        .contact-info li {
          margin-bottom: 6px;
          color: #555;
          font-size: 13px;
        }
        
        .skill-category {
          margin-bottom: 15px;
        }
        
        .skill-category-title {
          font-weight: bold;
          color: #333;
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        .skill-list {
          list-style: none;
        }
        
        .skill-list li {
          color: #555;
          font-size: 12px;
          margin-bottom: 3px;
          position: relative;
          padding-left: 10px;
        }
        
        .skill-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #666;
        }
        
        .education-item {
          margin-bottom: 15px;
        }
        
        .university {
          font-weight: bold;
          color: #333;
          font-size: 13px;
        }
        
        .degree {
          color: #555;
          font-size: 12px;
          margin-bottom: 3px;
        }
        
        .education-location {
          color: #555;
          font-size: 12px;
          font-style: italic;
        }
        
        .education-date {
          color: #555;
          font-size: 12px;
        }
        
        .certification {
          color: #555;
          font-size: 12px;
          margin-bottom: 5px;
        }
        
        .previous-experience {
          margin-top: 30px;
        }
        
        .prev-job {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 13px;
        }
        
        .prev-job-title {
          color: #333;
        }
        
        .prev-job-company {
          color: #666;
        }
        
        .prev-job-date {
          color: #666;
        }
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

          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="sidebar-section">
              <div className="section-title">OTHER</div>
              {resumeData.certifications.map((cert, idx) => (
                <div key={idx} className="certification">{cert}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
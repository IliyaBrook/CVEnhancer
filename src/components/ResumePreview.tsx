import React from 'react';
import type { ResumeData } from '@/types';

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
        .resume-container {
          max-width: 900px;
          margin: 0 auto;
          background-color: white;
          display: flex;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
          line-height: 1.3;
          color: #333;
        }
        
        .main-content {
          flex: 2;
          padding: 35px 40px;
        }
        
        .sidebar {
          flex: 1;
          background-color: #dceefb;
          padding: 35px 25px;
        }
        
        .header {
          margin-bottom: 30px;
        }
        
        .name {
          font-size: 36px;
          font-weight: bold;
          color: #1a4d8f;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }
        
        .title {
          font-size: 16px;
          color: #555;
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #1a4d8f;
          margin-bottom: 15px;
          margin-top: 25px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .section-title:first-child {
          margin-top: 0;
        }
        
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
import React from 'react';
import type { ResumeData } from '@/types';
import { downloadPDF } from '@/utils/pdfExport';

interface ExportButtonsProps {
  resumeData: ResumeData | null;
  disabled?: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ resumeData, disabled }) => {
  const generateHTML = (): string => {
    if (!resumeData) return '';

    const { personalInfo, experience, skills, education, militaryService } = resumeData;

    const experienceHTML =
      experience
        ?.map(
          exp => `
      <div class="job">
        <div class="company-info">
          <span class="company-name">${exp.company}</span>, <span class="location">${exp.location || ''}</span>
        </div>
        <div class="job-title-line">
          <span class="job-title">${exp.title}</span>
          <span class="date-range">${exp.dateRange}</span>
        </div>
        ${exp.duties ? `<ul class="job-duties">${exp.duties.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      </div>
    `
        )
        .join('') || '';

    const skillsHTML =
      skills
        ?.map(
          category => `
      <div class="skill-category">
        <div class="skill-category-title">${category.title}:</div>
        <ul class="skill-list">${category.skills.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    `
        )
        .join('') || '';

    const educationHTML =
      education
        ?.map(
          edu => `
      <div class="education-item">
        <div class="university">${edu.institution}</div>
        <div class="degree">${edu.degree}</div>
        ${edu.field ? `<div class="degree">${edu.field}</div>` : ''}
        ${edu.location ? `<div class="education-location">${edu.location}</div>` : ''}
        ${edu.dateRange && edu.dateRange !== '-' ? `<div class="education-date">${edu.dateRange}</div>` : ''}
      </div>
    `
        )
        .join('') || '';

    const contactHTML = [personalInfo.location, personalInfo.phone, personalInfo.email, personalInfo.linkedin]
      .filter(Boolean)
      .map(item => `<li>${item}</li>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; line-height: 1.3; color: #333; }
    .resume-container { background-color: white; display: flex; }
    .main-content { flex: 2; padding: 35px 40px; }
    .sidebar { flex: 1; background-color: #dceefb; padding: 35px 25px; }
    .header { margin-bottom: 30px; }
    .name { font-size: 36px; font-weight: bold; color: #1a4d8f; margin-bottom: 5px; letter-spacing: 0.5px; }
    .title { font-size: 16px; color: #555; margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: bold; color: #1a4d8f; margin-bottom: 15px; margin-top: 25px; text-transform: uppercase; letter-spacing: 1.5px; }
    .section-title:first-child { margin-top: 0; }
    .job { margin-bottom: 20px; }
    .company-info { margin-bottom: 8px; }
    .company-name { font-weight: bold; color: #333; display: inline; }
    .location { color: #666; font-style: italic; display: inline; }
    .job-title-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .job-title { font-weight: bold; color: #333; }
    .date-range { color: #666; font-size: 14px; }
    .job-duties { list-style: none; padding-left: 0; }
    .job-duties li { position: relative; padding-left: 15px; margin-bottom: 5px; color: #333; line-height: 1.35; font-size: 14px; }
    .job-duties li::before { content: "•"; color: #1a4d8f; position: absolute; left: 0; top: 0; font-weight: bold; }
    .sidebar-section { margin-bottom: 25px; }
    .sidebar .section-title { font-size: 13px; color: #1a4d8f; margin-bottom: 12px; margin-top: 0; }
    .contact-info { list-style: none; }
    .contact-info li { margin-bottom: 6px; color: #555; font-size: 13px; }
    .skill-category { margin-bottom: 15px; }
    .skill-category-title { font-weight: bold; color: #333; font-size: 13px; margin-bottom: 6px; }
    .skill-list { list-style: none; }
    .skill-list li { color: #555; font-size: 12px; margin-bottom: 3px; position: relative; padding-left: 10px; }
    .skill-list li::before { content: "•"; position: absolute; left: 0; color: #666; }
    .education-item { margin-bottom: 15px; }
    .university { font-weight: bold; color: #333; font-size: 13px; }
    .degree { color: #555; font-size: 12px; margin-bottom: 3px; }
    .education-location { color: #555; font-size: 12px; font-style: italic; }
    .education-date { color: #555; font-size: 12px; }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="main-content">
      <div class="header">
        <h1 class="name">${personalInfo.name}</h1>
        ${personalInfo.title ? `<div class="title">${personalInfo.title}</div>` : ''}
      </div>
      ${
        experience && experience.length > 0
          ? `
        <div class="section-title">WORK EXPERIENCE</div>
        ${experienceHTML}
      `
          : ''
      }
      ${
        education && education.length > 0
          ? `
        <div class="section-title">EDUCATION</div>
        ${educationHTML}
      `
          : ''
      }
      ${
        militaryService && militaryService.trim().length > 0
          ? `
        <div style="margin-top: 15px;">
          <div class="section-title">MILITARY SERVICE</div>
          <p style="color: #555; font-size: 11px; line-height: 1.4;">${militaryService}</p>
        </div>
      `
          : ''
      }
    </div>
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="section-title">CONTACT</div>
        <ul class="contact-info">${contactHTML}</ul>
      </div>
      ${
        skills && skills.length > 0
          ? `
        <div class="sidebar-section">
          <div class="section-title">SKILLS</div>
          ${skillsHTML}
        </div>
      `
          : ''
      }
    </div>
  </div>
</body>
</html>`;
  };

  const handleCopyHTML = async () => {
    const html = generateHTML();
    try {
      await navigator.clipboard.writeText(html);
      alert('HTML copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy HTML:', error);
      alert('Failed to copy HTML to clipboard');
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData) return;

    try {
      await downloadPDF(resumeData);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Export Options
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownloadPDF}
          disabled={disabled || !resumeData}
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:scale-100 flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Download as PDF
        </button>
        <button
          onClick={handleCopyHTML}
          disabled={disabled || !resumeData}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:scale-100 flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Copy as HTML
        </button>
      </div>
    </div>
  );
};

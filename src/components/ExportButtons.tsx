import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types';

interface ExportButtonsProps {
  resumeData: ResumeData | null;
  disabled?: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ resumeData, disabled }) => {
  const generateHTML = (): string => {
    if (!resumeData) return '';

    const { personalInfo, experience, skills, education } = resumeData;

    const experienceHTML = experience?.map(exp => `
      <div class="job">
        <div class="company-info">
          <span class="company-name">${exp.company}</span>, <span class="location">${exp.location || ''}</span>
        </div>
        ${exp.description ? `<div class="company-description">${exp.description}</div>` : ''}
        <div class="job-title-line">
          <span class="job-title">${exp.title}</span>
          <span class="date-range">${exp.dateRange}</span>
        </div>
        ${exp.duties ? `<ul class="job-duties">${exp.duties.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('') || '';

    const skillsHTML = skills?.map(category => `
      <div class="skill-category">
        <div class="skill-category-title">${category.title}:</div>
        <ul class="skill-list">${category.skills.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    `).join('') || '';

    const educationHTML = education?.map(edu => `
      <div class="education-item">
        <div class="university">${edu.institution}</div>
        <div class="degree">${edu.degree}</div>
        ${edu.field ? `<div class="degree">${edu.field}</div>` : ''}
        ${edu.location ? `<div class="education-location">${edu.location}</div>` : ''}
        ${edu.dateRange ? `<div class="education-date">${edu.dateRange}</div>` : ''}
      </div>
    `).join('') || '';

    const contactHTML = [
      personalInfo.location,
      personalInfo.phone,
      personalInfo.email,
      personalInfo.linkedin
    ].filter(Boolean).map(item => `<li>${item}</li>`).join('');

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
    .company-description { color: #666; font-style: italic; font-size: 13px; margin-bottom: 6px; }
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
      ${experience && experience.length > 0 ? `
        <div class="section-title">WORK EXPERIENCE</div>
        ${experienceHTML}
      ` : ''}
    </div>
    <div class="sidebar">
      <div class="sidebar-section">
        <div class="section-title">CONTACT</div>
        <ul class="contact-info">${contactHTML}</ul>
      </div>
      ${skills && skills.length > 0 ? `
        <div class="sidebar-section">
          <div class="section-title">SKILLS</div>
          ${skillsHTML}
        </div>
      ` : ''}
      ${education && education.length > 0 ? `
        <div class="sidebar-section">
          <div class="section-title">EDUCATION</div>
          ${educationHTML}
        </div>
      ` : ''}
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

    const html = generateHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleDownloadPDF}
        disabled={disabled || !resumeData}
        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Download as PDF
      </button>
      <button
        onClick={handleCopyHTML}
        disabled={disabled || !resumeData}
        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Copy as HTML
      </button>
    </div>
  );
};
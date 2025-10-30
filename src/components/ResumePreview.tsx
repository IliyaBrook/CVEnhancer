import React from 'react';
import type { ResumeData } from '../types';

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
      
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">
            {resumeData.personalInfo.name}
          </h1>
          {resumeData.personalInfo.title && (
            <p className="text-gray-600">{resumeData.personalInfo.title}</p>
          )}
        </div>

        {resumeData.experience && resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 uppercase tracking-wide mb-3">
              Experience
            </h2>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{exp.title}</p>
                    <p className="text-gray-600 italic">{exp.company}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{exp.dateRange}</p>
                </div>
                {exp.duties && (
                  <ul className="mt-2 space-y-1">
                    {exp.duties.map((duty, i) => (
                      <li key={i} className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-900">
                        {duty}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 uppercase tracking-wide mb-3">
              Skills
            </h2>
            {resumeData.skills.map((category, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold text-sm">{category.title}:</p>
                <p className="text-sm text-gray-700">{category.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
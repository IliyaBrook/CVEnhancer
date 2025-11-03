import React, { useState, useEffect } from 'react';
import type { ResumeConfig } from '@/types';
import { saveResumeConfig, loadResumeConfig } from '@/utils';
import resumeConfigDefault from '@/config/resume-ai-config.json';

interface ResumeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeSettingsModal: React.FC<ResumeSettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<ResumeConfig>(resumeConfigDefault as ResumeConfig);
  const [excludeJobInput, setExcludeJobInput] = useState('');
  const [excludeEducationInput, setExcludeEducationInput] = useState('');

  useEffect(() => {
    const loadedConfig = loadResumeConfig();
    if (loadedConfig) {
      // Ensure pdf settings exist for backward compatibility
      if (!loadedConfig.pdf) {
        loadedConfig.pdf = { singlePageExport: false };
      }
      setConfig(loadedConfig);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveResumeConfig(config);
    onClose();
  };

  const handleAddExcludeJob = () => {
    if (excludeJobInput.trim()) {
      setConfig({
        ...config,
        experience: {
          ...config.experience,
          exclude: [...config.experience.exclude, excludeJobInput.trim()]
        }
      });
      setExcludeJobInput('');
    }
  };

  const handleRemoveExcludeJob = (index: number) => {
    setConfig({
      ...config,
      experience: {
        ...config.experience,
        exclude: config.experience.exclude.filter((_, i) => i !== index)
      }
    });
  };

  const handleAddExcludeEducation = () => {
    if (excludeEducationInput.trim()) {
      setConfig({
        ...config,
        education: {
          ...config.education,
          exclude: [...config.education.exclude, excludeEducationInput.trim()]
        }
      });
      setExcludeEducationInput('');
    }
  };

  const handleRemoveExcludeEducation = (index: number) => {
    setConfig({
      ...config,
      education: {
        ...config.education,
        exclude: config.education.exclude.filter((_, i) => i !== index)
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-violet-50/30 rounded-2xl shadow-2xl border border-violet-100/50 max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-violet-50 to-purple-50 border-b-2 border-violet-200 px-6 py-5 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Resume Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-100 rounded-xl transition-all duration-200 hover:scale-110 group"
          >
            <svg className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 space-y-8">
          <div className="border-b-2 border-violet-100 pb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">Experience Settings</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  Max Jobs
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.experience.maxJobs}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, maxJobs: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  Bullet Points per Job
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.experience.bulletPointsPerJob}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, bulletPointsPerJob: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  Max Bullet Length
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="No limit"
                  value={config.experience.maxBulletLength || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, maxBulletLength: e.target.value ? parseInt(e.target.value) : null }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 placeholder:text-gray-400 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  Metrics Level
                </label>
                <select
                  value={config.experience.metricsLevel}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, metricsLevel: e.target.value as 'low' | 'moderate' | 'high' }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 cursor-pointer font-medium text-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.experience.requireActionVerbs}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, requireActionVerbs: e.target.checked }
                  })}
                  className="w-5 h-5 rounded-lg text-violet-600 focus:ring-4 focus:ring-violet-500/20 border-2 border-gray-300 cursor-pointer transition-all"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-700 transition-colors">Require Action Verbs</span>
              </label>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.experience.avoidDuplicatePoints}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, avoidDuplicatePoints: e.target.checked }
                  })}
                  className="w-5 h-5 rounded-lg text-violet-600 focus:ring-4 focus:ring-violet-500/20 border-2 border-gray-300 cursor-pointer transition-all"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-700 transition-colors">Avoid Duplicate Points</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                Exclude Jobs
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={excludeJobInput}
                  onChange={(e) => setExcludeJobInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeJob()}
                  placeholder="Job title to exclude"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-white hover:border-violet-300 placeholder:text-gray-400 font-medium text-gray-900"
                />
                <button
                  onClick={handleAddExcludeJob}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {config.experience.exclude.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {config.experience.exclude.map((job, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-xl text-sm font-semibold border-2 border-violet-200 hover:border-violet-300 transition-all group"
                    >
                      {job}
                      <button
                        onClick={() => handleRemoveExcludeJob(index)}
                        className="text-violet-500 hover:text-rose-600 hover:bg-white rounded-lg p-1 transition-all group-hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-b-2 border-violet-100 pb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Skills Settings</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Categories Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.skills.categoriesLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    skills: { ...config.skills, categoriesLimit: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Skills per Category
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.skills.skillsPerCategory}
                  onChange={(e) => setConfig({
                    ...config,
                    skills: { ...config.skills, skillsPerCategory: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300 font-medium text-gray-900"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Education Settings</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Max Entries
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.education.maxEntries}
                  onChange={(e) => setConfig({
                    ...config,
                    education: { ...config.education, maxEntries: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300 font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Placement
                </label>
                <select
                  value={config.education.placement}
                  onChange={(e) => setConfig({
                    ...config,
                    education: { ...config.education, placement: e.target.value as 'main-content' | 'sidebar' }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300 cursor-pointer font-medium text-gray-900"
                >
                  <option value="main-content">Main Content (Left)</option>
                  <option value="sidebar">Sidebar (Right)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.education.showDates}
                  onChange={(e) => setConfig({
                    ...config,
                    education: { ...config.education, showDates: e.target.checked }
                  })}
                  className="w-5 h-5 rounded-lg text-blue-600 focus:ring-4 focus:ring-blue-500/20 border-2 border-gray-300 cursor-pointer transition-all"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Show Dates</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Exclude Education
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={excludeEducationInput}
                  onChange={(e) => setExcludeEducationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeEducation()}
                  placeholder="Education to exclude"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white hover:border-blue-300 placeholder:text-gray-400 font-medium text-gray-900"
                />
                <button
                  onClick={handleAddExcludeEducation}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {config.education.exclude.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {config.education.exclude.map((edu, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl text-sm font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all group"
                    >
                      {edu}
                      <button
                        onClick={() => handleRemoveExcludeEducation(index)}
                        className="text-blue-500 hover:text-rose-600 hover:bg-white rounded-lg p-1 transition-all group-hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-rose-100 to-red-100 rounded-lg">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">PDF Export Settings</h3>
            </div>

            <div>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.pdf.singlePageExport}
                  onChange={(e) => setConfig({
                    ...config,
                    pdf: { ...config.pdf, singlePageExport: e.target.checked }
                  })}
                  className="w-5 h-5 rounded-lg text-rose-600 focus:ring-4 focus:ring-rose-500/20 border-2 border-gray-300 cursor-pointer transition-all"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-700 transition-colors">Single Page Export</span>
                  <span className="text-xs text-gray-500 mt-0.5">Export PDF as one continuous page without page breaks</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-violet-50 to-purple-50 border-t-2 border-violet-200 px-6 py-5 flex justify-end gap-4 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-violet-300 hover:text-violet-700 transition-all duration-200 font-semibold hover:scale-105 shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
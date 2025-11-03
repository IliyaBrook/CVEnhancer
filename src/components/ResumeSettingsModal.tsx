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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Resume Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Experience Settings</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metrics Level
                </label>
                <select
                  value={config.experience.metricsLevel}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, metricsLevel: e.target.value as 'low' | 'moderate' | 'high' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.experience.requireActionVerbs}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, requireActionVerbs: e.target.checked }
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Require Action Verbs</span>
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.experience.avoidDuplicatePoints}
                  onChange={(e) => setConfig({
                    ...config,
                    experience: { ...config.experience, avoidDuplicatePoints: e.target.checked }
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Avoid Duplicate Points</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclude Jobs
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={excludeJobInput}
                  onChange={(e) => setExcludeJobInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeJob()}
                  placeholder="Job title to exclude"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddExcludeJob}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {config.experience.exclude.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {config.experience.exclude.map((job, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {job}
                      <button
                        onClick={() => handleRemoveExcludeJob(index)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Education Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.education.showDates}
                  onChange={(e) => setConfig({
                    ...config,
                    education: { ...config.education, showDates: e.target.checked }
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Show Dates</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclude Education
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={excludeEducationInput}
                  onChange={(e) => setExcludeEducationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeEducation()}
                  placeholder="Education to exclude"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddExcludeEducation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {config.education.exclude.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {config.education.exclude.map((edu, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {edu}
                      <button
                        onClick={() => handleRemoveExcludeEducation(index)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
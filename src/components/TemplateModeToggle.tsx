import React from 'react';
import { useAppDispatch, useAppSelector, setTemplateMode } from '@/store';

export const TemplateModeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const isTemplateMode = useAppSelector(state => state.app.isTemplateMode);

  const handleUploadModeClick = () => {
    if (isTemplateMode) {
      dispatch(setTemplateMode(false));
    }
  };

  const handleTemplateModeClick = () => {
    if (!isTemplateMode) {
      dispatch(setTemplateMode(true));
    }
  };

  return (
    <div className="default-container">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-800">Application Mode</h3>
        <p className="mt-1 text-xs text-gray-600">Choose how you want to work with resumes</p>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={handleUploadModeClick}
          className={`w-full rounded-xl border-2 p-3.5 text-left transition-all duration-300 ${
            !isTemplateMode
              ? 'border-violet-500 bg-violet-100 shadow-md'
              : 'border-gray-200 bg-white hover:border-violet-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                !isTemplateMode
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-800">Upload Mode</div>
              <div className="text-xs text-gray-600">Upload your own resume file</div>
            </div>
            {!isTemplateMode && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </button>

        <button
          onClick={handleTemplateModeClick}
          className={`w-full rounded-xl border-2 p-3.5 text-left transition-all duration-300 ${
            isTemplateMode
              ? 'border-violet-500 bg-violet-100 shadow-md'
              : 'border-gray-200 bg-white hover:border-violet-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                isTemplateMode
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-800">Template Mode</div>
              <div className="text-xs text-gray-600">Load saved resume templates</div>
            </div>
            {isTemplateMode && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { validateFile } from '@/utils/fileValidation';
import { saveJobTitle, loadJobTitle } from '@/utils/storage';
import type { SupportedFileType } from '@/types';

interface FileUploaderProps {
  onFileSelect: (file: File, fileType: SupportedFileType, jobTitle?: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');
  const dragCounter = useRef(0);

  // Load job title from localStorage on mount
  useEffect(() => {
    const savedJobTitle = loadJobTitle();
    setJobTitle(savedJobTitle);
  }, []);

  // Save job title to localStorage when it changes
  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setJobTitle(newValue);
    saveJobTitle(newValue);
  };

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      const validation = validateFile(file);

      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      if (validation.fileType) {
        onFileSelect(file, validation.fileType, jobTitle || undefined);
      }
    },
    [onFileSelect, jobTitle]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  return (
    <div className="group mb-6 rounded-2xl border border-cyan-100/50 bg-gradient-to-br from-white to-cyan-50/30 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-cyan-200 hover:shadow-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 shadow-lg">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h2 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent">
          Upload Resume
        </h2>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-gray-700">Job Title / Profession (Optional)</label>
        <input
          type="text"
          value={jobTitle}
          onChange={handleJobTitleChange}
          placeholder="e.g., Full Stack Developer, Sales Manager"
          className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-4 py-3 outline-none backdrop-blur-sm transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
        />
        <p className="mt-2 text-xs text-gray-500">
          Optional: Specify your profession to help AI better understand and enhance your resume
        </p>
      </div>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'scale-[1.02] border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-xl shadow-cyan-500/20'
            : 'border-gray-300 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-cyan-50/50'
        } `}
      >
        {isDragging && (
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        )}

        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 p-5">
            <svg
              className={`h-16 w-16 transition-all duration-300 ${
                isDragging ? 'scale-110 text-cyan-600' : 'text-gray-400'
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mb-4 text-lg font-semibold text-gray-700">
            {isDragging ? 'Drop your file here' : 'Drag and drop your resume here'}
          </p>

          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium text-gray-500">or</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>

          <label className="group/btn inline-block cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/40">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Browse Files
            </span>
            <input type="file" className="hidden" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" onChange={handleFileInput} />
          </label>

          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Supported formats: PDF, DOCX, JPEG, PNG (Max 10MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 p-4 shadow-sm">
          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium text-rose-800">{error}</p>
        </div>
      )}
    </div>
  );
};

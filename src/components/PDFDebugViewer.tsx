import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import type { ResumeData, ResumeConfig } from '@/types';
import { ResumePDFDocument } from './ResumePDFDocument';
import { loadResumeConfig } from '@/utils';
import resumeConfigDefault from '@/config/resume-ai-config.json';

interface PDFDebugViewerProps {
  resumeData: ResumeData;
  isDebugMode?: boolean;
}

export const PDFDebugViewer: React.FC<PDFDebugViewerProps> = ({ resumeData, isDebugMode = false }) => {
  const [config, setConfig] = useState<ResumeConfig>(resumeConfigDefault as ResumeConfig);

  useEffect(() => {
    const loadedConfig = loadResumeConfig();
    if (loadedConfig) {
      // Ensure pdf settings exist for backward compatibility
      if (!loadedConfig.pdf) {
        loadedConfig.pdf = { singlePageExport: false };
      }
      setConfig(loadedConfig);
    }
  }, []);

  const title = isDebugMode ? 'PDF Export Preview (Debug Mode)' : 'PDF Export Preview';

  return (
    <div id="pdf-debug-viewer" className="mt-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {config.pdf.singlePageExport && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
            Single Page Mode
          </span>
        )}
      </div>
      <div className="w-full" style={{ height: '800px' }}>
        <PDFViewer key={Date.now()} width="100%" height="100%" showToolbar={true}>
          <ResumePDFDocument resumeData={resumeData} />
        </PDFViewer>
      </div>
    </div>
  );
};

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import type { ResumeData } from '@/types';
import { ResumePDFDocument } from './ResumePDFDocument';
import { useAppSelector } from '@/store';

interface PDFExportViewerProps {
  resumeData: ResumeData;
}

export const PDFExportViewer: React.FC<PDFExportViewerProps> = ({ resumeData }) => {
  const config = useAppSelector(state => state.resumeConfig.config);

  return (
    <div id="pdf-export-viewer" className="mt-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">PDF Export Preview</h2>
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

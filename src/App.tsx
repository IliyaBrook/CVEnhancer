import { useState, useEffect } from 'react';
import {
  AIProviderSettings,
  FileUploader,
  ResumePreview,
  ExportButtons,
  ProcessingStatus,
  PDFDebugViewer,
} from '@/components';
import { useAIConfig } from '@/hooks';
import { parseFile } from '@/utils';
import { enhanceResume } from '@/services';
import { debug } from '@/config';
import { fakeResumeData } from '@/fakeData';
import type { ResumeData, ProcessingStatus as StatusType, SupportedFileType } from '@/types';

function App() {
  const { config, updateConfig } = useAIConfig();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (debug) {
      setResumeData(fakeResumeData);
      setStatus('completed');
    }
  }, []);

  const handleFileSelect = async (file: File, fileType: SupportedFileType) => {
    setStatus('parsing');
    setError('');

    try {
      const extractedText = await parseFile(file, fileType);

      if (!config) {
        setError('Please configure AI provider settings first');
        setStatus('error');
        return;
      }

      if (!config.apiKey && config.provider !== 'ollama') {
        setError('Please configure AI provider settings first');
        setStatus('error');
        return;
      }

      setStatus('enhancing');
      const enhanced = await enhanceResume(extractedText, config);

      console.log('=== Generated Resume Data ===');
      console.log(enhanced);

      setResumeData(enhanced);
      setStatus('completed');
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="mb-3 text-5xl font-bold text-gray-900">CVEnhancer</h1>
          <p className="text-xl text-gray-600">Upload any resume, download a better one</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <AIProviderSettings config={config} onConfigChange={updateConfig} />

            <FileUploader onFileSelect={handleFileSelect} />

            {error && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <p className="font-medium text-red-800">{error}</p>
              </div>
            )}

            <ProcessingStatus status={status} />

            {resumeData && (
              <ExportButtons resumeData={resumeData} disabled={status === 'parsing' || status === 'enhancing'} />
            )}
          </div>

          <div className="lg:col-span-2">
            <ResumePreview resumeData={resumeData} />
            {resumeData && <PDFDebugViewer resumeData={resumeData} isDebugMode={debug} />}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <p className="text-sm">Powered by AI | Built with React, TypeScript & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

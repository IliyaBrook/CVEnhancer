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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <header className="mb-16 text-center space-y-4">
          <div className="inline-block">
            <h1 className="mb-3 text-6xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
              CVEnhancer
            </h1>
          </div>
          <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
            Upload any resume, download a better one
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              AI-Powered
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Secure
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <AIProviderSettings config={config} onConfigChange={updateConfig} />

            <FileUploader onFileSelect={handleFileSelect} />

            {error && (
              <div className="rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-red-50 p-5 shadow-lg shadow-rose-500/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 bg-rose-100 rounded-lg">
                    <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-rose-900 mb-1">Error</p>
                    <p className="font-medium text-rose-800">{error}</p>
                  </div>
                </div>
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

        <footer className="mt-16 pt-8 border-t-2 border-white/50 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-white/80 rounded-full text-gray-600 font-medium shadow-sm">
                Powered by AI
              </span>
              <span className="text-gray-400">|</span>
              <span className="px-3 py-1.5 bg-white/80 rounded-full text-gray-600 font-medium shadow-sm">
                Built with React, TypeScript & Tailwind CSS
              </span>
            </div>
            <p className="text-xs text-gray-500">Version 1.0.0 - 2024</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

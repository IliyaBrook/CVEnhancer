import { useState, useEffect } from 'react';
import { AIProviderSettings, FileUploader, ResumePreview, ExportButtons, ProcessingStatus } from '@/components';
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            CVEnhancer
          </h1>
          <p className="text-xl text-gray-600">
            Upload any resume, download a better one
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <AIProviderSettings
              config={config}
              onConfigChange={updateConfig}
            />
            
            <FileUploader
              onFileSelect={handleFileSelect}
            />

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            <ProcessingStatus status={status} />

            {resumeData && (
              <ExportButtons 
                resumeData={resumeData}
                disabled={status === 'parsing' || status === 'enhancing'}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Powered by AI | Built with React, TypeScript & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
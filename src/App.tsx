import './utils/suppressWarnings';
import { useEffect } from 'react';
import {
  AIProviderSettings,
  FileUploader,
  ResumePreview,
  ExportButtons,
  ProcessingStatus,
  PDFExportViewer,
  JsonFileSelector,
  SaveJsonModal,
  TemplateModeToggle,
} from '@/components';
import { parseFile } from '@/utils';
import { enhanceResume } from '@/services';
import { resumeDataJSON } from '@/json_cv_data';
import type { ResumeData, SupportedFileType } from '@/types';
import { useAppDispatch, useAppSelector, setResumeData, setStatus, setError, openSaveModal } from '@/store';

function App() {
  const dispatch = useAppDispatch();
  const { resumeData, status, error, isTemplateMode } = useAppSelector(state => state.app);
  const config = useAppSelector(state => state.aiConfig.config);

  useEffect(() => {
    if (isTemplateMode) {
      dispatch(setResumeData(resumeDataJSON));
      dispatch(setStatus('completed'));
    }
  }, [dispatch, isTemplateMode]);

  const handleJsonFileSelect = (data: ResumeData) => {
    dispatch(setResumeData(data));
    dispatch(setStatus('completed'));
  };

  const handleFileSelect = async (file: File, fileType: SupportedFileType, jobTitle?: string) => {
    dispatch(setStatus('parsing'));
    dispatch(setError(''));

    try {
      if (!config) {
        dispatch(setError('Please configure AI provider settings first'));
        dispatch(setStatus('error'));
        return;
      }

      if (config.provider !== 'ollama') {
        const hasApiKey =
          (config.provider === 'openai' && config.apiKeys?.openai) ||
          (config.provider === 'claude' && config.apiKeys?.claude);

        if (!hasApiKey) {
          dispatch(setError('Please configure AI provider settings first'));
          dispatch(setStatus('error'));
          return;
        }
      }

      const parsedData = await parseFile(file, fileType, config);
      dispatch(setStatus('enhancing'));
      const enhanced = await enhanceResume(parsedData, config, jobTitle);

      dispatch(setResumeData(enhanced));
      dispatch(setStatus('completed'));
    } catch (err) {
      console.error('Processing error:', err);
      dispatch(setError(err instanceof Error ? err.message : 'Unknown error occurred'));
      dispatch(setStatus('error'));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-cyan-50 to-blue-50">
      <div className="flex flex-col gap-6 px-4 py-8 lg:flex-row lg:gap-8 xl:gap-10 2xl:gap-12">
        {/* Settings panels - adaptive grid */}
        <div
          className="grid flex-1 auto-rows-min gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          <AIProviderSettings />
          <div className="flex flex-col gap-1.5">
            <TemplateModeToggle />
            {resumeData && (
              <ExportButtons resumeData={resumeData} disabled={status === 'parsing' || status === 'enhancing'} />
            )}
          </div>
          {isTemplateMode && <JsonFileSelector onFileSelect={handleJsonFileSelect} />}
          {!isTemplateMode && <FileUploader onFileSelect={handleFileSelect} />}

          {error && (
            <div className="rounded-xl border-2 border-rose-300 from-rose-50 to-red-50 p-4 shadow-lg shadow-rose-500/20 transition-all duration-300">
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 rounded-lg bg-rose-100 p-1.5">
                  <svg className="h-4 w-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold text-rose-900">Error</p>
                  <p className="text-xs font-medium text-rose-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isTemplateMode && <ProcessingStatus status={status} />}

          {resumeData && (
            <>
              <button
                onClick={() => dispatch(openSaveModal())}
                disabled={status === 'parsing' || status === 'enhancing'}
                className="group w-full rounded-2xl border-2 border-violet-300 bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-3.5 shadow-lg transition-all duration-300 hover:border-violet-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-2.5">
                  <div className="rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-1.5 shadow-md transition-transform duration-300 group-hover:scale-110">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-gray-800">Save JSON Data</span>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Preview section - always vertical */}
        <div className="space-y-6 lg:w-[850px] lg:flex-shrink-0">
          <ResumePreview resumeData={resumeData} />
          {resumeData && <PDFExportViewer resumeData={resumeData} />}
        </div>
      </div>

      <SaveJsonModal />
    </div>
  );
}

export default App;

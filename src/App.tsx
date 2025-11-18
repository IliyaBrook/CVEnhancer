import {useState, useEffect} from 'react';
import {
	AIProviderSettings,
	FileUploader,
	ResumePreview,
	ExportButtons,
	ProcessingStatus,
	PDFDebugViewer,
} from '@/components';
import {useAIConfig} from '@/hooks';
import {parseFile} from '@/utils';
import {enhanceResume} from '@/services';
import {debug} from '@/config';
import {resumeDataJSON} from '@/json_cv_data';
import type {ResumeData, ProcessingStatus as StatusType, SupportedFileType} from '@/types';


function App() {
	const {config, updateConfig} = useAIConfig();
	const [resumeData, setResumeData] = useState<ResumeData | null>(null);
	const [status, setStatus] = useState<StatusType>('idle');
	const [error, setError] = useState<string>('');
	
	useEffect(() => {
		if (debug) {
			setResumeData(resumeDataJSON);
			setStatus('completed');
		}
	}, []);
	
	const handleFileSelect = async (file: File, fileType: SupportedFileType, jobTitle?: string) => {
		setStatus('parsing');
		setError('');
		
		try {
			if (!config) {
				setError('Please configure AI provider settings first');
				setStatus('error');
				return;
			}
			
			// Check if API key is present for the current provider
			if (config.provider !== 'ollama') {
				const hasApiKey =
					(config.provider === 'openai' && config.apiKeys?.openai) ||
					(config.provider === 'claude' && config.apiKeys?.claude);
				
				if (!hasApiKey) {
					setError('Please configure AI provider settings first');
					setStatus('error');
					return;
				}
			}
			
			// Parse file with config to determine vision mode
			const parsedData = await parseFile(file, fileType, config);
			
			console.log('=== Parsed Resume Data ===');
			console.log('Vision mode:', parsedData.isVisionMode);
			if (parsedData.text) {
				console.log('Text length:', parsedData.text.length);
				console.log('First 500 chars:', parsedData.text.substring(0, 500));
			}
			if (parsedData.images) {
				console.log('Number of images:', parsedData.images.length);
			}
			
			setStatus('enhancing');
			const enhanced = await enhanceResume(parsedData, config, jobTitle);
			
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
		<div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-cyan-50 to-blue-50'>
			<div className='container mx-auto max-w-7xl px-4 py-8'>
				<header className='mb-16 space-y-4 text-center'>
					<div className='inline-block'>
						<h1
							className='mb-3 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-6xl font-extrabold text-transparent drop-shadow-sm'>
							CVEnhancer
						</h1>
					</div>
					<p className='mx-auto max-w-2xl text-xl font-medium text-gray-700'>
						Upload any resume, download a better one
					</p>
					<div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
            <span
	            className='inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1.5 font-medium text-violet-700'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
	                d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
              AI-Powered
            </span>
					</div>
				</header>
				
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 xl:gap-10'>
					<div className='space-y-6 lg:col-span-1'>
						<AIProviderSettings config={config} onConfigChange={updateConfig} />
						
						<FileUploader onFileSelect={handleFileSelect} />
						
						{error && (
							<div
								className='rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-red-50 p-5 shadow-lg shadow-rose-500/20 transition-all duration-300'>
								<div className='flex items-start gap-3'>
									<div className='flex-shrink-0 rounded-lg bg-rose-100 p-2'>
										<svg className='h-5 w-5 text-rose-600' fill='currentColor' viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div>
										<p className='mb-1 font-bold text-rose-900'>Error</p>
										<p className='font-medium text-rose-800'>{error}</p>
									</div>
								</div>
							</div>
						)}
						
						<ProcessingStatus status={status} />
						
						{resumeData && (
							<ExportButtons resumeData={resumeData} disabled={status === 'parsing' || status === 'enhancing'} />
						)}
					</div>
					
					<div className='lg:col-span-2'>
						<ResumePreview resumeData={resumeData} />
						{resumeData && <PDFDebugViewer resumeData={resumeData} isDebugMode={debug} />}
					</div>
				</div>
				
				<footer className='mt-20'>
					<div className='mb-8 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent'></div>
					
					<div
						className='rounded-2xl border border-violet-100/50 bg-gradient-to-br from-white to-violet-50/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
						<div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
							<div className='flex items-center gap-2'>
								<div className='rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-md'>
									<svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2.5}
											d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
										/>
									</svg>
								</div>
								<div>
									<p
										className='bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-sm font-bold text-transparent'>
										CVEnhancer
									</p>
									<p className='text-xs text-gray-500'>AI-Powered Resume Enhancement</p>
								</div>
							</div>
							
							<div className='flex flex-col items-center gap-2 md:items-end'>
								<div className='flex items-center gap-2'>
                  <span
	                  className='inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700'>
                    <svg className='h-3 w-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path
	                      fillRule='evenodd'
	                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
	                      clipRule='evenodd'
                      />
                    </svg>
                    v1.0.0
                  </span>
								</div>
								<p className='text-xs font-medium text-gray-600'>
									Crafted by{' '}
									<span
										className='bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text font-bold text-transparent'>
                    Iliya Brook
                  </span>{' '}
									• 2025
								</p>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default App;

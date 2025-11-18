import {useState, useEffect} from 'react';
import axios from 'axios';
import {saveSelectedJsonFile, loadSelectedJsonFile} from '@/utils/storage';

interface JsonFile {
	name: string;
	displayName: string;
}

interface JsonFileSelectorProps {
	onFileSelect: (data: any) => void;
}

export function JsonFileSelector({onFileSelect}: JsonFileSelectorProps) {
	const [files, setFiles] = useState<JsonFile[]>([]);
	const [selectedFile, setSelectedFile] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	
	useEffect(() => {
		void loadFileList();
	}, []);
	
	const loadFileList = async () => {
		try {
			const response = await axios.get<JsonFile[]>('/api/json-files');
			setFiles(response.data);
			
			const savedFile = loadSelectedJsonFile();
			if (savedFile && response.data.some(f => f.name === savedFile)) {
				setSelectedFile(savedFile);
				void loadFile(savedFile);
			}
		} catch (err) {
			console.error('Error loading file list:', err);
			setError('Failed to load file list');
		}
	};
	
	const loadFile = async (filename: string) => {
		setLoading(true);
		setError('');
		
		try {
			const response = await axios.get(`/api/json-files/${filename}`);
			onFileSelect(response.data);
		} catch (err) {
			console.error('Error loading file:', err);
			setError('Failed to load file');
		} finally {
			setLoading(false);
		}
	};
	
	const handleFileChange = async (filename: string) => {
		if (!filename) {
			setSelectedFile('');
			saveSelectedJsonFile('');
			return;
		}
		
		setSelectedFile(filename);
		saveSelectedJsonFile(filename);
		await loadFile(filename);
	};
	
	return (
		<div
			className='rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl'>
			<div className='mb-4 flex items-center gap-3'>
				<div className='rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-md'>
					<svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
						/>
					</svg>
				</div>
				<div>
					<h3 className='text-lg font-bold text-gray-800'>Load JSON File</h3>
					<p className='text-sm text-gray-500'>Select a saved resume file</p>
				</div>
			</div>
			
			{error && (
				<div className='mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700'>
					{error}
				</div>
			)}
			
			<select
				value={selectedFile}
				onChange={(e) => handleFileChange(e.target.value)}
				disabled={loading}
				className='w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-violet-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50'
			>
				<option value=''>Select a file...</option>
				{files && files?.length > 0 && files.map((file) => (
					<option key={file.name} value={file.name}>
						{file.displayName}
					</option>
				))}
			</select>
			
			{loading && (
				<div className='mt-3 flex items-center gap-2 text-sm text-violet-600'>
					<svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
						<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
						<path
							className='opacity-75'
							fill='currentColor'
							d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
						/>
					</svg>
					Loading file...
				</div>
			)}
		</div>
	);
}

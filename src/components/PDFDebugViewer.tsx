import React from 'react';
import {PDFViewer} from '@react-pdf/renderer';
import type {ResumeData} from '@/types';
import { ResumePDFDocument } from './ResumePDFDocument';

interface PDFDebugViewerProps {
	resumeData: ResumeData;
	isDebugMode?: boolean;
}

export const PDFDebugViewer: React.FC<PDFDebugViewerProps> = ({resumeData, isDebugMode = false}) => {
	const title = isDebugMode ? 'PDF Export Preview (Debug Mode)' : 'PDF Export Preview';
	
	return (
		<div id="pdf-debug-viewer" className='bg-white rounded-lg shadow-md p-6 mt-6'>
			<h2 className='text-2xl font-bold text-gray-800 mb-4'>{title}</h2>
			<div className='w-full' style={{height: '800px'}}>
				<PDFViewer width='100%' height='100%' showToolbar={true}>
					<ResumePDFDocument resumeData={resumeData} />
				</PDFViewer>
			</div>
		</div>
	);
};
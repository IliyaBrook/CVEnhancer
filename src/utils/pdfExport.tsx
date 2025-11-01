import {pdf} from '@react-pdf/renderer';
import type {ResumeData} from '@/types';
import {ResumePDFDocument} from '@/components/ResumePDFDocument';

export const generatePDFBlob = async (resumeData: ResumeData): Promise<Blob> => {
	return await pdf(<ResumePDFDocument resumeData={resumeData} />).toBlob();
};

export const downloadPDF = async (resumeData: ResumeData, filename?: string): Promise<void> => {
	const blob = await generatePDFBlob(resumeData);
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename || `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
	link.click();
	URL.revokeObjectURL(url);
};
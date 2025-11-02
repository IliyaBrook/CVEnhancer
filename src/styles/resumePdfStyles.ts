import {StyleSheet} from '@react-pdf/renderer';

export const resumePdfStyles = StyleSheet.create({
	page: {
		flexDirection: 'row',
		backgroundColor: 'white',
		display: 'flex',
		boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
		fontFamily: 'Helvetica',
		color: '#333',
	},
	mainContent: {
		flex: 2,
		padding: '35px 40px'
	},
	sidebar: {
		flex: 1,
		backgroundColor: '#dceefb',
		padding: '35px 25px',
	},
	header: {
		marginBottom: 30,
	},
	name: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#1a4d8f',
		marginBottom: 5,
		letterSpacing: 0.5,
	},
	titleText: {
		fontSize: 16,
		color: '#555',
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#1a4d8f',
		marginBottom: 15,
		marginTop: 25,
		textTransform: 'uppercase',
		letterSpacing: 1.5,
	},
	sectionTitleFirst: {
		marginTop: 0,
	},
	job: {
		marginBottom: 20,
	},
	companyInfo: {
		marginBottom: 8,
		flexDirection: 'row',
	},
	companyName: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 14,
	},
	location: {
		color: '#666',
		fontStyle: 'italic',
		fontSize: 14,
	},
	companyDescription: {
		color: '#666',
		fontStyle: 'italic',
		fontSize: 13,
		marginBottom: 6,
	},
	jobTitleLine: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	jobTitle: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 14,
	},
	dateRange: {
		color: '#666',
		fontSize: 14,
	},
	jobDuties: {
		marginTop: 5,
	},
	jobDuty: {
		flexDirection: 'row',
		marginBottom: 5,
		fontSize: 14,
		color: '#333',
		lineHeight: 1.35,
	},
	bullet: {
		color: '#1a4d8f',
		fontWeight: 'bold',
		marginRight: 5,
	},
	dutyText: {
		flex: 1,
	},
	sidebarSection: {
		marginBottom: 25,
	},
	sidebarSectionTitle: {
		fontSize: 13,
		fontWeight: 'bold',
		color: '#1a4d8f',
		marginBottom: 12,
		textTransform: 'uppercase',
		letterSpacing: 1.5,
	},
	contactInfo: {
		marginBottom: 6,
		color: '#555',
		fontSize: 13,
	},
	skillCategory: {
		marginBottom: 15,
	},
	skillCategoryTitle: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 13,
		marginBottom: 6,
	},
	skillItem: {
		flexDirection: 'row',
		marginBottom: 3,
		fontSize: 12,
		color: '#555',
	},
	skillBullet: {
		marginRight: 5,
		color: '#666',
	},
	educationItem: {
		marginBottom: 15,
	},
	university: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 13,
	},
	degree: {
		color: '#555',
		fontSize: 12,
		marginBottom: 3,
	},
	educationLocation: {
		color: '#555',
		fontSize: 12,
		fontStyle: 'italic',
	},
	educationDate: {
		color: '#555',
		fontSize: 12,
	},
	certification: {
		color: '#555',
		fontSize: 12,
		marginBottom: 5,
	},
	previousExperience: {
		marginTop: 30,
	},
	prevJob: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
		fontSize: 13,
	},
	prevJobTitle: {
		color: '#333',
	},
	prevJobCompany: {
		color: '#666',
	},
	prevJobDate: {
		color: '#666',
	},
});
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
		padding: '25px 30px' // уменьшено с 35px 40px
	},
	sidebar: {
		flex: 1,
		backgroundColor: '#dceefb',
		padding: '25px 20px', // уменьшено с 35px 25px
	},
	header: {
		marginBottom: 18, // уменьшено с 30
		fontWeight: 'bold',
	},
	name: {
		fontSize: 28, // уменьшено с 36
		fontWeight: 'bold',
		color: '#1a4d8f',
		marginBottom: 3, // уменьшено с 5
		letterSpacing: 0.3, // уменьшено с 0.5
	},
	titleText: {
		fontSize: 13, // уменьшено с 16
		color: '#555',
		marginBottom: 12, // уменьшено с 16
	},
	sectionTitle: {
		fontSize: 12, // уменьшено с 14
		fontWeight: 'bold',
		color: '#1a4d8f',
		marginBottom: 10, // уменьшено с 15
		marginTop: 0,
		textTransform: 'uppercase',
		letterSpacing: 1.2, // уменьшено с 1.5
	},
	sectionTitleWithMargin: {
		fontSize: 12, // уменьшено с 14
		fontWeight: 'bold',
		color: '#1a4d8f',
		marginBottom: 8, // уменьшено с 10
		marginTop: 0,
		textTransform: 'uppercase',
		letterSpacing: 1.2, // уменьшено с 1.5
	},
	job: {
		marginBottom: 12, // уменьшено с 20
		minPresenceAhead: 24,
	},
	companyInfo: {
		marginBottom: 5, // уменьшено с 8
		flexDirection: 'row',
	},
	companyName: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 12, // уменьшено с 14
	},
	location: {
		color: '#666',
		fontStyle: 'italic',
		fontSize: 11, // уменьшено с 14
	},
	companyDescription: {
		color: '#666',
		fontStyle: 'italic',
		fontSize: 10, // уменьшено с 13
		marginBottom: 4, // уменьшено с 6
	},
	jobTitleLine: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5, // уменьшено с 8
	},
	jobTitle: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 11, // уменьшено с 14
	},
	dateRange: {
		color: '#666',
		fontSize: 11, // уменьшено с 14
	},
	jobDutiesList: {
		listStyle: 'none',
		paddingLeft: 0,
	},
	jobDuties: {
		marginTop: 3, // уменьшено с 5
	},
	jobDutyLi: {
		position: 'relative',
		paddingLeft: 15,
		marginBottom: 5,
		fontSize: 14,
		color: '#333',
		lineHeight: 1.35,
	},
	jobDuty: {
		flexDirection: 'row',
		marginBottom: 3, // уменьшено с 5
		fontSize: 10.5, // уменьшено с 14
		color: '#333',
		lineHeight: 1.25, // уменьшено с 1.35
	},
	bulletBefore: {
		content: '•',
		position: 'absolute',
		left: 0,
		top: 0,
		color: '#1a4d8f',
		fontWeight: 'bold',
	},
	bullet: {
		color: '#1a4d8f',
		fontWeight: 'bold',
		marginRight: 4, // уменьшено с 5
		fontSize: 10, // добавлено для меньшего буллета
	},
	dutyText: {
		flex: 1,
	},
	sidebarSection: {
		marginBottom: 18, // уменьшено с 25
	},
	sidebarContactSection: {
		marginBottom: 18, // уменьшено с 25
		lineHeight: 0.8
	},
	contactInfoList: {
		listStyle: 'none',
	},
	contactInfo: {
		marginBottom: 4, // уменьшено с 6
		color: '#555',
		fontSize: 11, // уменьшено с 13
	},
	skillCategory: {
		marginBottom: 10, // уменьшено с 15
		minPresenceAhead: 12,
	},
	skillCategoryTitle: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 11, // уменьшено с 13
		marginBottom: 4, // уменьшено с 6
	},
	skillList: {
		listStyle: 'none',
	},
	skillItemLi: {
		position: 'relative',
		paddingLeft: 10,
		marginBottom: 3,
		fontSize: 12,
		color: '#555',
	},
	skillItem: {
		flexDirection: 'row',
		marginBottom: 2, // уменьшено с 3
		fontSize: 10, // уменьшено с 12
		color: '#555',
	},
	skillBulletBefore: {
		content: '•',
		position: 'absolute',
		left: 0,
		color: '#666',
	},
	skillBullet: {
		marginRight: 4, // уменьшено с 5
		color: '#666',
		fontSize: 9, // добавлено
	},
	skillText: {
		flex: 1,
	},
	educationItem: {
		marginBottom: 10, // уменьшено с 15
		minPresenceAhead: 12,
	},
	university: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: 11, // уменьшено с 13
	},
	degree: {
		color: '#555',
		fontSize: 10, // уменьшено с 12
		marginBottom: 2, // уменьшено с 3
	},
	educationLocation: {
		color: '#555',
		fontSize: 10, // уменьшено с 12
		fontStyle: 'italic',
	},
	educationDate: {
		color: '#555',
		fontSize: 10, // уменьшено с 12
	},
});
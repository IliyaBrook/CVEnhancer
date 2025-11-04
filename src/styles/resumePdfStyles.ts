import { StyleSheet } from '@react-pdf/renderer';

export const resumePdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
    display: 'flex',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Helvetica',
    color: '#333',
    hyphenationFactor: 0,
  },
  mainContent: {
    flex: 2,
    padding: '25px 30px',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#dceefb',
    padding: '25px 20px',
  },
  header: {
    marginBottom: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a4d8f',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a4d8f',
    marginBottom: 10,
    marginTop: 0,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionTitleWithMargin: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a4d8f',
    marginBottom: 8,
    marginTop: 0,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  job: {
    marginBottom: 12,
    minPresenceAhead: 24,
  },
  lastJobElement: {
    marginBottom: 5,
  },
  companyInfo: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  companyName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 10,
  },
  location: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 11,
  },
  jobTitleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  jobTitle: {
    fontWeight: 'bold',
    color: '#1d76b6',
    fontSize: 11,
  },
  jobTitleSuffix: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 11,
  },
  dateRange: {
    color: '#666',
    fontSize: 11,
  },
  jobDutiesList: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  jobDuties: {
    marginTop: 3,
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
    marginBottom: 3,
    fontSize: 10.5,
    color: '#333',
    lineHeight: 1.25,
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
    marginRight: 4,
    fontSize: 10,
  },
  dutyText: {
    flex: 1,
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarContactSection: {
    marginBottom: 18,
    lineHeight: 0.8,
  },
  contactInfoList: {
    listStyle: 'none',
  },
  contactInfo: {
    marginBottom: 4,
    color: '#555',
    fontSize: 11,
  },
  skillCategory: {
    marginBottom: 10,
    minPresenceAhead: 12,
  },
  skillCategoryTitle: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 11,
    marginBottom: 4,
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
    marginBottom: 2,
    fontSize: 10,
    color: '#555',
  },
  skillBulletBefore: {
    content: '•',
    position: 'absolute',
    left: 0,
    color: '#666',
  },
  skillBullet: {
    marginRight: 4,
    color: '#666',
    fontSize: 9,
  },
  skillText: {
    flex: 1,
  },
  educationSectionTitle: {
    marginBottom: 5,
  },
  educationItem: {
    marginBottom: 5,
    minPresenceAhead: 12,
  },
  university: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 11,
  },
  degree: {
    color: '#555',
    fontSize: 10,
    marginBottom: 2,
  },
  educationLocation: {
    color: '#555',
    fontSize: 10,
    fontStyle: 'italic',
  },
  educationDate: {
    color: '#555',
    fontSize: 10,
  },
  educationSection: {
    marginTop: 15,
  },
  educationItemMain: {
    marginBottom: 10,
    minPresenceAhead: 12,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  universityMain: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 12,
  },
  degreeMain: {
    color: '#555',
    fontSize: 11,
    marginBottom: 2,
  },
  educationLocationMain: {
    color: '#666',
    fontSize: 10,
    fontStyle: 'italic',
  },
  educationDateMain: {
    color: '#666',
    fontSize: 11,
  },
  militarySection: {
    marginTop: 15,
  },
  militarySectionTitle: {
    marginBottom: 5,
    color: '#1d76b6',
    fontSize: '11px',
  },
  militaryText: {
    color: '#555',
    fontSize: 11,
    lineHeight: 1.4,
  },
});

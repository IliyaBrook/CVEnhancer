import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf} from '@react-pdf/renderer';
import type { ResumeData } from '@/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  mainContent: {
    flex: 2,
    padding: '35px 40px',
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
});

interface ResumePDFDocumentProps {
  resumeData: ResumeData;
}

const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ resumeData }) => {
  const { personalInfo, experience, skills, education, certifications } = resumeData;

  return (
    <Document>
      <Page
	      size="A4"
	      style={styles.page}
      >
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.name}</Text>
            {personalInfo.title && <Text style={styles.titleText}>{personalInfo.title}</Text>}
          </View>

          {experience && experience.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>WORK EXPERIENCE</Text>
              {experience.map((exp, index) => (
                <View key={index} style={styles.job}>
                  <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    {exp.location && <Text style={styles.location}>, {exp.location}</Text>}
                  </View>
                  {exp.description && (
                    <Text style={styles.companyDescription}>{exp.description}</Text>
                  )}
                  <View style={styles.jobTitleLine}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.dateRange}>{exp.dateRange}</Text>
                  </View>
                  {exp.duties && exp.duties.length > 0 && (
                    <View style={styles.jobDuties}>
                      {exp.duties.map((duty, dutyIndex) => (
                        <View key={dutyIndex} style={styles.jobDuty}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.dutyText}>{duty}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sidebar}>
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>CONTACT</Text>
            {personalInfo.location && (
              <Text style={styles.contactInfo}>{personalInfo.location}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactInfo}>{personalInfo.phone}</Text>
            )}
            {personalInfo.email && (
              <Text style={styles.contactInfo}>{personalInfo.email}</Text>
            )}
            {personalInfo.linkedin && (
              <Text style={styles.contactInfo}>{personalInfo.linkedin}</Text>
            )}
          </View>

          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>SKILLS</Text>
              {skills.map((category, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category.categoryTitle}</Text>
                  {category.skills.map((skill, skillIndex) => (
                    <View key={skillIndex} style={styles.skillItem}>
                      <Text style={styles.skillBullet}>•</Text>
                      <Text>{skill}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {education && education.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>EDUCATION</Text>
              {education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <Text style={styles.university}>{edu.university || edu.institution}</Text>
                  {edu.degree && <Text style={styles.degree}>{edu.degree}</Text>}
                  {edu.field && <Text style={styles.degree}>{edu.field}</Text>}
                  {edu.location && (
                    <Text style={styles.educationLocation}>{edu.location}</Text>
                  )}
                  {edu.dateRange && (
                    <Text style={styles.educationDate}>{edu.dateRange}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {certifications && certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>OTHER</Text>
              {certifications.map((cert, index) => (
                <Text key={index} style={styles.certification}>{cert}</Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export const generatePDFBlob = async (resumeData: ResumeData): Promise<Blob> => {
  const blob = await pdf(<ResumePDFDocument resumeData={resumeData} />).toBlob();
  return blob;
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
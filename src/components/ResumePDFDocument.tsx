import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ResumeData } from '@/types';
import { resumePdfStyles as styles } from '@/styles/resumePdfStyles';

interface ResumePDFDocumentProps {
  resumeData: ResumeData;
}

export const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ resumeData }) => {
  const { personalInfo, experience, skills, education, certifications, previousExperience } = resumeData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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

          {previousExperience && previousExperience.length > 0 && (
            <View style={styles.previousExperience}>
              <Text style={styles.sectionTitle}>PREVIOUS EXPERIENCE</Text>
              {previousExperience.map((prev, index) => (
                <View key={index} style={styles.prevJob}>
                  <View>
                    <Text style={styles.prevJobTitle}>{prev.title}</Text>
                    <Text>, </Text>
                    <Text style={styles.prevJobCompany}>{prev.company}</Text>
                  </View>
                  <Text style={styles.prevJobDate}>{prev.dateRange}</Text>
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
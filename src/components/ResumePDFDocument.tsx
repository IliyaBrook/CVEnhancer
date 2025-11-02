import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ResumeData } from '@/types';
import { resumePdfStyles as styles } from '@/styles/resumePdfStyles';

interface ResumePDFDocumentProps {
  resumeData: ResumeData;
}

export const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ resumeData }) => {
  const { personalInfo, experience, skills, education, militaryService } = resumeData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainContent}>
          <View style={styles.header} wrap={false}>
            <Text style={styles.name}>{personalInfo.name}</Text>
            {personalInfo.title && <Text style={styles.titleText}>{personalInfo.title}</Text>}
          </View>

          {experience && experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
              {experience.map((exp, index) => (
                <View
                  key={index}
                  style={experience.length - 1 === index ? [styles.job, styles.lastJobElement] : styles.job}
                >
                  <View style={styles.companyInfo} wrap={false}>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    {exp.location && <Text style={styles.location}>, {exp.location}</Text>}
                  </View>
                  {exp.description && <Text style={styles.companyDescription}>{exp.description}</Text>}
                  <View style={styles.jobTitleLine} wrap={false}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.dateRange}>{exp.dateRange}</Text>
                  </View>
                  {exp.duties && exp.duties.length > 0 && (
                    <View style={styles.jobDuties}>
                      {exp.duties.map((duty, dutyIndex) => (
                        <View key={dutyIndex} style={styles.jobDuty} wrap={false}>
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

          {education && education.length > 0 && (
            <View style={styles.educationSection}>
              <Text style={[styles.sectionTitle, styles.educationSectionTitle]}>EDUCATION</Text>
              {education.map((edu, index) => (
                <View key={index} style={styles.educationItemMain}>
                  <View style={styles.educationHeader}>
                    <Text style={styles.universityMain}>{edu.university || edu.institution}</Text>
                    {edu.dateRange && edu.dateRange !== '-' && (
                      <Text style={styles.educationDateMain}>{edu.dateRange}</Text>
                    )}
                  </View>
                  {edu.degree && <Text style={styles.degreeMain}>{edu.degree}</Text>}
                  {edu.field && <Text style={styles.degreeMain}>{edu.field}</Text>}
                  {edu.location && <Text style={styles.educationLocationMain}>{edu.location}</Text>}
                </View>
              ))}
            </View>
          )}

          {militaryService && militaryService.trim().length > 0 && (
            <View style={styles.militarySection}>
              <Text style={[styles.sectionTitle, styles.militarySectionTitle]}>MILITARY SERVICE</Text>
              <Text style={styles.militaryText}>{militaryService}</Text>
            </View>
          )}
        </View>

        <View style={styles.sidebar}>
          <View style={styles.sidebarContactSection}>
            <Text style={styles.sectionTitle}>CONTACT</Text>
            {personalInfo.location && <Text style={styles.contactInfo}>{personalInfo.location}</Text>}
            {personalInfo.phone && <Text style={styles.contactInfo}>{personalInfo.phone}</Text>}
            {personalInfo.email && <Text style={styles.contactInfo}>{personalInfo.email}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactInfo}>{personalInfo.linkedin}</Text>}
          </View>

          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitleWithMargin}>SKILLS</Text>
              {skills.map((category, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category.categoryTitle}</Text>
                  {category.skills.map((skill, skillIndex) => (
                    <View key={skillIndex} style={styles.skillItem}>
                      <Text style={styles.skillBullet}>•</Text>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

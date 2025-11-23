import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ResumeData, Education } from '@/types';
import { resumePdfStyles as styles } from '@/styles/resumePdfStyles';
import HtmlContent from './HtmlContent';
import { store } from '@/store';

// Education component for reuse - defined outside to prevent recreation on each render
interface EducationSectionProps {
  education: Education[];
  showInMain: boolean;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, showInMain }) => {
  // Early return if no education data
  if (!education || !Array.isArray(education) || education.length === 0) {
    return null;
  }

  return (
    <View style={showInMain ? styles.educationSection : styles.sidebarSection}>
      <Text style={showInMain ? [styles.sectionTitle, styles.educationSectionTitle] : styles.sectionTitleWithMargin}>
        EDUCATION
      </Text>
      {education.map((edu, index) => (
        <View key={index} style={showInMain ? styles.educationItemMain : styles.educationItem}>
          {showInMain ? (
            <>
              <View style={styles.educationHeader}>
                <Text style={styles.universityMain}>{edu?.university || edu?.institution || 'Institution'}</Text>
                {edu?.dateRange && edu.dateRange !== '-' && (
                  <Text style={styles.educationDateMain}>{edu.dateRange}</Text>
                )}
              </View>
              {edu?.degree && <Text style={styles.degreeMain}>{edu.degree}</Text>}
              {edu?.field && <Text style={styles.degreeMain}>{edu.field}</Text>}
              {edu?.location && <Text style={styles.educationLocationMain}>{edu.location}</Text>}
            </>
          ) : (
            <>
              <Text style={styles.university}>{edu?.university || edu?.institution || 'Institution'}</Text>
              {edu?.degree && <Text style={styles.degree}>{edu.degree}</Text>}
              {edu?.field && <Text style={styles.degree}>{edu.field}</Text>}
              {edu?.location && <Text style={styles.educationLocation}>{edu.location}</Text>}
              {edu?.dateRange && edu.dateRange !== '-' && <Text style={styles.educationDate}>{edu.dateRange}</Text>}
            </>
          )}
        </View>
      ))}
    </View>
  );
};

interface ResumePDFDocumentProps {
  resumeData: ResumeData;
}

export const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ resumeData }) => {
  const safeResumeData: ResumeData = {
    personalInfo: resumeData?.personalInfo || {
      name: 'N/A',
      title: '',
      email: '',
      phone: '',
      location: '',
    },
    experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
    skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
    education: Array.isArray(resumeData?.education) ? resumeData.education : [],
    militaryService: resumeData?.militaryService || '',
  };

  const { personalInfo, experience, skills, education, militaryService = '' } = safeResumeData;
  const config = store.getState().resumeConfig.config;

  return (
    <Document>
      <Page wrap={!config?.pdf?.singlePageExport} size="A4" style={styles.page}>
        <View style={styles.mainContent}>
          <View style={styles.header} wrap={false}>
            <Text style={styles.name}>{personalInfo?.name || 'N/A'}</Text>
            {personalInfo?.title && <Text style={styles.title}>{personalInfo.title}</Text>}
          </View>

          {experience && experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
              {experience
                .filter(exp => exp && typeof exp === 'object' && (exp.company || exp.title))
                .map((exp, index) => (
                  <View
                    key={index}
                    style={experience.length - 1 === index ? [styles.job, styles.lastJobElement] : styles.job}
                  >
                    <View style={styles.companyInfo} wrap={false}>
                      <Text style={styles.companyName}>{exp?.company || 'Unknown Company'}</Text>
                      {exp?.location && <Text style={styles.location}>, {exp.location}</Text>}
                    </View>
                    <View style={styles.jobTitleLine} wrap={false}>
                      <Text style={styles.jobTitle}>{exp?.title || 'Position'}</Text>
                      <Text style={styles.dateRange}>{exp?.dateRange || 'N/A'}</Text>
                    </View>
                    {exp?.duties && Array.isArray(exp.duties) && exp.duties.length > 0 && (
                      <View style={styles.jobDuties}>
                        {exp.duties
                          .filter(
                            duty =>
                              duty !== null && duty !== undefined && typeof duty === 'string' && duty.trim().length > 0
                          )
                          .map((duty, dutyIndex) => (
                            <View key={dutyIndex} style={styles.jobDuty} wrap={false}>
                              <Text style={styles.bullet}>•</Text>
                              <Text style={styles.dutyText}>
                                <HtmlContent>{duty}</HtmlContent>
                              </Text>
                            </View>
                          ))}
                      </View>
                    )}
                  </View>
                ))}
            </View>
          )}

          {config.education.placement === 'main-content' && (
            <EducationSection education={education} showInMain={true} />
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
            {personalInfo?.location && <Text style={styles.contactInfo}>{personalInfo?.location}</Text>}
            {personalInfo?.phone && <Text style={styles.contactInfo}>{personalInfo?.phone}</Text>}
            {personalInfo?.email && <Text style={styles.contactInfo}>{personalInfo?.email}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactInfo}>{personalInfo?.linkedin}</Text>}
          </View>

          {skills && Array.isArray(skills) && skills?.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitleWithMargin}>SKILLS</Text>
              {skills
                .filter(category => category && typeof category === 'object' && category.categoryTitle)
                .map((category, index) => {
                  // Ensure category.skills is a valid array of strings
                  const validSkills = Array.isArray(category.skills)
                    ? category.skills.filter(
                        skill =>
                          skill !== null && skill !== undefined && typeof skill === 'string' && skill.trim().length > 0
                      )
                    : [];

                  // Only render category if it has valid skills
                  if (validSkills.length === 0) return null;

                  return (
                    <View key={index} style={styles.skillCategory}>
                      <Text style={styles.skillCategoryTitle}>{category?.categoryTitle || 'Category'}</Text>
                      {validSkills.map((skill, skillIndex) => (
                        <View key={skillIndex} style={styles.skillItem}>
                          <Text style={styles.skillBullet}>•</Text>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
            </View>
          )}

          {/* Education in sidebar if placement is 'sidebar' */}
          {config?.education?.placement === 'sidebar' && <EducationSection education={education} showInMain={false} />}
        </View>
      </Page>
    </Document>
  );
};

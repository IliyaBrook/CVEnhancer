import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ResumeData, ResumeConfig, Education } from '@/types';
import { resumePdfStyles as styles } from '@/styles/resumePdfStyles';
import { loadResumeConfig } from '@/utils';
import resumeConfigDefault from '@/config/resume-ai-config.json';

// Helper function to safely render text (protect against null/undefined/objects/arrays)
const safeText = (value: any, fallback: string = ''): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  // Protect against arrays, objects, and functions - never render them directly
  if (Array.isArray(value)) return fallback;
  if (typeof value === 'object') return fallback;
  if (typeof value === 'function') return fallback;
  return fallback;
};

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
                <Text style={styles.universityMain}>
                  {safeText(edu?.university || edu?.institution, 'Institution')}
                </Text>
                {edu?.dateRange && edu.dateRange !== '-' && (
                  <Text style={styles.educationDateMain}>{safeText(edu.dateRange)}</Text>
                )}
              </View>
              {edu?.degree && <Text style={styles.degreeMain}>{safeText(edu.degree)}</Text>}
              {edu?.field && <Text style={styles.degreeMain}>{safeText(edu.field)}</Text>}
              {edu?.location && <Text style={styles.educationLocationMain}>{safeText(edu.location)}</Text>}
            </>
          ) : (
            <>
              <Text style={styles.university}>{safeText(edu?.university || edu?.institution, 'Institution')}</Text>
              {edu?.degree && <Text style={styles.degree}>{safeText(edu.degree)}</Text>}
              {edu?.field && <Text style={styles.degree}>{safeText(edu.field)}</Text>}
              {edu?.location && <Text style={styles.educationLocation}>{safeText(edu.location)}</Text>}
              {edu?.dateRange && edu.dateRange !== '-' && (
                <Text style={styles.educationDate}>{safeText(edu.dateRange)}</Text>
              )}
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
  // Validate and sanitize resumeData to prevent rendering errors
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
  const loadedConfig = loadResumeConfig() || (resumeConfigDefault as ResumeConfig);

  // Ensure placement exists for backward compatibility
  if (!loadedConfig.education.placement) {
    loadedConfig.education.placement = 'main-content';
  }

  // Ensure pdf settings exist for backward compatibility
  if (!loadedConfig.pdf) {
    loadedConfig.pdf = { singlePageExport: false };
  }

  const config: ResumeConfig = loadedConfig;

  return (
    <Document>
      <Page wrap={!config?.pdf?.singlePageExport} size="A4" style={styles.page}>
        <View style={styles.mainContent}>
          <View style={styles.header} wrap={false}>
            <Text style={styles.name}>{safeText(personalInfo?.name, 'N/A')}</Text>
            {personalInfo?.title && <Text style={styles.title}>{safeText(personalInfo.title)}</Text>}
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
                    <Text style={styles.companyName}>{safeText(exp?.company, 'Unknown Company')}</Text>
                    {exp?.location && <Text style={styles.location}>, {safeText(exp.location)}</Text>}
                  </View>
                  <View style={styles.jobTitleLine} wrap={false}>
                    <Text style={styles.jobTitle}>{safeText(exp?.title, 'Position')}</Text>
                    <Text style={styles.dateRange}>{safeText(exp?.dateRange, 'N/A')}</Text>
                  </View>
                  {exp?.duties && Array.isArray(exp.duties) && exp.duties.length > 0 && (
                    <View style={styles.jobDuties}>
                      {exp.duties
                        .filter(duty => duty !== null && duty !== undefined && typeof duty === 'string' && duty.trim().length > 0)
                        .map((duty, dutyIndex) => (
                          <View key={dutyIndex} style={styles.jobDuty} wrap={false}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.dutyText}>{safeText(duty, '')}</Text>
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
              <Text style={styles.militaryText}>{safeText(militaryService)}</Text>
            </View>
          )}
        </View>

        <View style={styles.sidebar}>
          <View style={styles.sidebarContactSection}>
            <Text style={styles.sectionTitle}>CONTACT</Text>
            {personalInfo?.location && <Text style={styles.contactInfo}>{safeText(personalInfo?.location)}</Text>}
            {personalInfo?.phone && <Text style={styles.contactInfo}>{safeText(personalInfo?.phone)}</Text>}
            {personalInfo?.email && <Text style={styles.contactInfo}>{safeText(personalInfo?.email)}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactInfo}>{safeText(personalInfo?.linkedin)}</Text>}
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
                        skill => skill !== null && skill !== undefined && typeof skill === 'string' && skill.trim().length > 0
                      )
                    : [];

                  // Only render category if it has valid skills
                  if (validSkills.length === 0) return null;

                  return (
                    <View key={index} style={styles.skillCategory}>
                      <Text style={styles.skillCategoryTitle}>{safeText(category?.categoryTitle, 'Category')}</Text>
                      {validSkills.map((skill, skillIndex) => (
                        <View key={skillIndex} style={styles.skillItem}>
                          <Text style={styles.skillBullet}>•</Text>
                          <Text style={styles.skillText}>{safeText(skill, '')}</Text>
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

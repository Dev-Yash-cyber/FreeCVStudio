export type PaperSize = 'A4' | 'Letter';

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  employer: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities?: string;
  bulletPoints: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa?: string;
  coursework?: string[];
  achievements?: string[];
}

export interface SkillItem {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
  projectUrl?: string;
  githubUrl?: string;
  bulletPoints: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  description?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date?: string;
  url?: string;
  description?: string;
}

export interface VolunteeringItem {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  bulletPoints: string[];
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bulletPoints: string[];
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface DesignSettings {
  templateId: string;
  fontFamily: string;
  fontSize: number;
  headingFontSize: number;
  nameFontSize: number;
  accentColor: string;
  textColor: string;
  headingColor: string;
  backgroundColor: string;
  margins: number;
  sectionSpacing: number;
  lineSpacing: number;
  paragraphSpacing: number;
  columnGap: number;
  dividerStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'thick' | 'gradient';
  headingStyle: 'standard' | 'uppercase' | 'underlined' | 'left-bar' | 'pill' | 'boxed';
  bulletStyle: 'disc' | 'circle' | 'square' | 'dash' | 'arrow' | 'check' | 'diamond';
  dateFormat: 'MMM YYYY' | 'MM/YYYY' | 'YYYY' | 'MMMM YYYY';
  paperSize: PaperSize;
  showPhoto: boolean;
  showIcons: boolean;
  twoColumnLayout?: boolean;
  entrySpacing?: number;
  layoutMode?: 'single' | 'two-column-left' | 'two-column-right';
  sidebarWidth?: number;
  datePosition?: 'right' | 'below' | 'inline';
  subtitleStyle?: 'normal' | 'bold' | 'italic' | 'uppercase';
  headingWeight?: '400' | '500' | '600' | '700';
  headingTracking?: 'normal' | 'wide' | 'wider';
  bodyWeight?: '300' | '400' | '500';
  secondaryColor?: string;
  headerAlignment?: 'left' | 'center' | 'right';
  nameStyle?: 'bold' | 'black' | 'uppercase';
  headerDivider?: 'none' | 'thin' | 'accent' | 'double';
  contactIconsStyle?: 'none' | 'simple' | 'accent' | 'badge';
  photoShape?: 'circle' | 'rounded' | 'square';
  photoSize?: number;
  photoBorder?: 'none' | 'thin' | 'thick-accent' | 'shadow';
  photoPosition?: 'left' | 'right' | 'center';
  photoGrayscale?: boolean;
  linkDisplayMode?: 'full' | 'short' | 'icon-label' | 'icon-only';
  linkUnderline?: boolean;
  linkColor?: 'accent' | 'muted' | 'text';
  showPageNumbers?: boolean;
  pageNumberPosition?: 'left' | 'center' | 'right';
  pageNumberFormat?: 'Page 1 of 1' | '1 / 1' | '1';
  footerText?: string;
  showFooterDivider?: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
  publications: PublicationItem[];
  volunteering: VolunteeringItem[];
  interests: string[];
  references: ReferenceItem[];
  customSections: CustomSection[];
  sectionOrder: string[];
  hiddenSections?: string[];
}

export interface ResumeModel {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  templateId: string;
  isArchived: boolean;
  isFavorite: boolean;
  versionCount: number;
  atsScore?: number;
  data: ResumeData;
  design: DesignSettings;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersionModel {
  _id: string;
  resumeId: string;
  versionNumber: number;
  label?: string;
  data: ResumeData;
  design: DesignSettings;
  createdAt: string;
}

export interface CoverLetterData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  jobTitle: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signOff: string;
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
}

export interface CoverLetterModel {
  _id: string;
  userId: string;
  title: string;
  linkedResumeId?: string;
  templateId: string;
  isArchived: boolean;
  data: CoverLetterData;
  design: {
    fontFamily: string;
    fontSize: number;
    accentColor: string;
    textColor: string;
    margins: number;
    lineSpacing: number;
    paperSize: PaperSize;
  };
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'Wishlist'
  | 'Preparing'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Assessment'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplicationModel {
  _id: string;
  userId: string;
  company: string;
  position: string;
  jobDescription?: string;
  jobUrl?: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  applicationDate?: string;
  status: ApplicationStatus;
  resumeId?: string;
  coverLetterId?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  followUpDate?: string;
  interviews?: Array<{
    round: string;
    date: string;
    interviewer?: string;
    notes?: string;
  }>;
  assessmentDetails?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    autoSave: boolean;
    defaultPaperSize: 'A4' | 'Letter';
  };
  isDemo?: boolean;
}

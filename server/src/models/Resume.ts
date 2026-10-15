import mongoose, { Schema, Document } from 'mongoose';
import { ResumeData, DesignSettings } from '../types/index.js';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  templateId: string;
  isArchived: boolean;
  isFavorite: boolean;
  versionCount: number;
  data: ResumeData;
  design: DesignSettings;
  atsScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'Untitled Resume' },
    description: { type: String, default: '' },
    templateId: { type: String, required: true, default: 'ats-professional' },
    isArchived: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false },
    versionCount: { type: Number, default: 1 },
    atsScore: { type: Number },
    data: {
      personalInfo: {
        fullName: { type: String, default: '' },
        headline: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        address: { type: String, default: '' },
        website: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        photoUrl: { type: String, default: '' },
        summary: { type: String, default: '' },
      },
      experience: [
        {
          id: { type: String, required: true },
          jobTitle: { type: String, default: '' },
          employer: { type: String, default: '' },
          employmentType: { type: String, default: 'Full-time' },
          location: { type: String, default: '' },
          startDate: { type: String, default: '' },
          endDate: { type: String, default: '' },
          isCurrent: { type: Boolean, default: false },
          responsibilities: { type: String, default: '' },
          bulletPoints: [{ type: String }],
          technologies: [{ type: String }],
        },
      ],
      education: [
        {
          id: { type: String, required: true },
          institution: { type: String, default: '' },
          degree: { type: String, default: '' },
          fieldOfStudy: { type: String, default: '' },
          location: { type: String, default: '' },
          startDate: { type: String, default: '' },
          endDate: { type: String, default: '' },
          isCurrent: { type: Boolean, default: false },
          gpa: { type: String, default: '' },
          coursework: [{ type: String }],
          achievements: [{ type: String }],
        },
      ],
      skillCategories: [
        {
          id: { type: String, required: true },
          categoryName: { type: String, default: 'Technical Skills' },
          skills: [
            {
              name: { type: String, required: true },
              level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Advanced' },
            },
          ],
        },
      ],
      projects: [
        {
          id: { type: String, required: true },
          name: { type: String, default: '' },
          description: { type: String, default: '' },
          role: { type: String, default: '' },
          technologies: [{ type: String }],
          startDate: { type: String, default: '' },
          endDate: { type: String, default: '' },
          projectUrl: { type: String, default: '' },
          githubUrl: { type: String, default: '' },
          bulletPoints: [{ type: String }],
        },
      ],
      certifications: [
        {
          id: { type: String, required: true },
          name: { type: String, default: '' },
          issuer: { type: String, default: '' },
          issueDate: { type: String, default: '' },
          expirationDate: { type: String, default: '' },
          credentialId: { type: String, default: '' },
          credentialUrl: { type: String, default: '' },
        },
      ],
      awards: [
        {
          id: { type: String, required: true },
          title: { type: String, default: '' },
          issuer: { type: String, default: '' },
          date: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
      publications: [
        {
          id: { type: String, required: true },
          title: { type: String, default: '' },
          publisher: { type: String, default: '' },
          date: { type: String, default: '' },
          url: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
      volunteering: [
        {
          id: { type: String, required: true },
          organization: { type: String, default: '' },
          role: { type: String, default: '' },
          location: { type: String, default: '' },
          startDate: { type: String, default: '' },
          endDate: { type: String, default: '' },
          isCurrent: { type: Boolean, default: false },
          bulletPoints: [{ type: String }],
        },
      ],
      interests: [{ type: String }],
      references: [
        {
          id: { type: String, required: true },
          name: { type: String, default: '' },
          title: { type: String, default: '' },
          company: { type: String, default: '' },
          email: { type: String, default: '' },
          phone: { type: String, default: '' },
          relationship: { type: String, default: '' },
        },
      ],
      customSections: [
        {
          id: { type: String, required: true },
          sectionTitle: { type: String, default: 'Custom Section' },
          items: [
            {
              id: { type: String, required: true },
              title: { type: String, default: '' },
              subtitle: { type: String, default: '' },
              date: { type: String, default: '' },
              description: { type: String, default: '' },
              bulletPoints: [{ type: String }],
            },
          ],
        },
      ],
      sectionOrder: {
        type: [String],
        default: [
          'personalInfo',
          'summary',
          'experience',
          'education',
          'skills',
          'projects',
          'certifications',
          'awards',
          'publications',
          'volunteering',
          'interests',
          'references',
        ],
      },
      hiddenSections: { type: [String], default: [] },
    },
    design: {
      type: Schema.Types.Mixed,
      default: {
        templateId: 'ats-professional',
        fontFamily: 'Inter',
        fontSize: 11,
        headingFontSize: 16,
        nameFontSize: 26,
        accentColor: '#2563eb',
        textColor: '#1e293b',
        headingColor: '#0f172a',
        backgroundColor: '#ffffff',
        margins: 24,
        sectionSpacing: 18,
        entrySpacing: 10,
        lineSpacing: 1.4,
        paragraphSpacing: 8,
        columnGap: 24,
        dividerStyle: 'solid',
        headingStyle: 'left-bar',
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        paperSize: 'A4',
        showPhoto: false,
        showIcons: true,
        twoColumnLayout: false,
      },
    },
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, updatedAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);

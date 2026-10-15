import mongoose, { Schema, Document } from 'mongoose';
import { ApplicationStatus } from '../types/index.js';

export interface IInterviewNote {
  round: string; // e.g. "Screening", "Technical", "Behavioral", "Final"
  date: Date;
  interviewer?: string;
  notes: string;
}

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  position: string;
  jobDescription?: string;
  jobUrl?: string;
  location?: string;
  employmentType?: string;
  salaryRange?: string;
  applicationDate?: Date;
  status: ApplicationStatus;
  resumeId?: mongoose.Types.ObjectId;
  coverLetterId?: mongoose.Types.ObjectId;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  followUpDate?: Date;
  interviews: IInterviewNote[];
  assessmentDetails?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    jobDescription: { type: String, default: '' },
    jobUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    employmentType: { type: String, default: 'Full-time' },
    salaryRange: { type: String, default: '' },
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        'Wishlist',
        'Preparing',
        'Applied',
        'Screening',
        'Interview',
        'Assessment',
        'Offer',
        'Rejected',
        'Withdrawn',
      ],
      default: 'Applied',
      index: true,
    },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    coverLetterId: { type: Schema.Types.ObjectId, ref: 'CoverLetter' },
    recruiterName: { type: String, default: '' },
    recruiterEmail: { type: String, default: '' },
    recruiterPhone: { type: String, default: '' },
    followUpDate: { type: Date },
    interviews: [
      {
        round: { type: String, default: 'Initial' },
        date: { type: Date, default: Date.now },
        interviewer: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    ],
    assessmentDetails: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ userId: 1, status: 1 });
JobApplicationSchema.index({ userId: 1, updatedAt: -1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

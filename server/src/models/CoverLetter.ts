import mongoose, { Schema, Document } from 'mongoose';
import { CoverLetterData } from '../types/index.js';

export interface ICoverLetter extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  linkedResumeId?: mongoose.Types.ObjectId;
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
    paperSize: 'A4' | 'Letter';
  };
  createdAt: Date;
  updatedAt: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'Untitled Cover Letter' },
    linkedResumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    templateId: { type: String, default: 'classic-letter' },
    isArchived: { type: Boolean, default: false },
    data: {
      recipientName: { type: String, default: 'Hiring Manager' },
      recipientTitle: { type: String, default: 'Head of Talent Acquisition' },
      companyName: { type: String, default: 'Acme Corporation' },
      companyAddress: { type: String, default: 'San Francisco, CA' },
      date: { type: String, default: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
      jobTitle: { type: String, default: 'Software Engineer' },
      salutation: { type: String, default: 'Dear Hiring Manager,' },
      openingParagraph: {
        type: String,
        default:
          'I am writing to express my enthusiastic interest in the Software Engineer position at your company. With a strong track record of engineering scalable applications and solving complex business challenges, I am excited about the opportunity to contribute to your team.',
      },
      bodyParagraphs: {
        type: [String],
        default: [
          'Throughout my career, I have specialized in building robust, performant web applications using modern technologies. In my previous roles, I led development on key initiatives that directly boosted application responsiveness by 35% and improved team velocity.',
          'Your team’s mission and focus on high-impact products resonate deeply with me. I am particularly drawn to your recent engineering milestones and would be thrilled to bring my proactive problem-solving, architectural skills, and collaborative mindset to your projects.',
        ],
      },
      closingParagraph: {
        type: String,
        default:
          'Thank you for your time and consideration. I welcome the opportunity to discuss how my technical skills and enthusiasm align with your team’s objectives. I look forward to hearing from you.',
      },
      signOff: { type: String, default: 'Sincerely,' },
      senderName: { type: String, default: '' },
      senderTitle: { type: String, default: '' },
      senderEmail: { type: String, default: '' },
      senderPhone: { type: String, default: '' },
      senderLocation: { type: String, default: '' },
    },
    design: {
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: Number, default: 11 },
      accentColor: { type: String, default: '#2563eb' },
      textColor: { type: String, default: '#1e293b' },
      margins: { type: Number, default: 32 },
      lineSpacing: { type: Number, default: 1.5 },
      paperSize: { type: String, default: 'A4' },
    },
  },
  { timestamps: true }
);

CoverLetterSchema.index({ userId: 1, updatedAt: -1 });

export const CoverLetter = mongoose.model<ICoverLetter>('CoverLetter', CoverLetterSchema);

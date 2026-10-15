import mongoose, { Schema, Document } from 'mongoose';
import { ResumeData, DesignSettings } from '../types/index.js';

export interface IResumeVersion extends Document {
  resumeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  versionNumber: number;
  label?: string;
  data: ResumeData;
  design: DesignSettings;
  createdAt: Date;
}

const ResumeVersionSchema = new Schema<IResumeVersion>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    versionNumber: { type: Number, required: true },
    label: { type: String, default: 'Autosave snapshot' },
    data: { type: Schema.Types.Mixed, required: true },
    design: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ResumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });

export const ResumeVersion = mongoose.model<IResumeVersion>('ResumeVersion', ResumeVersionSchema);

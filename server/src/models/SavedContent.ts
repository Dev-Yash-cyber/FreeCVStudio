import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedContent extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'star_story' | 'achievement' | 'reusable_bullet' | 'interview_prep';
  title: string;
  category?: string;
  content: {
    // For STAR story:
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    // For general achievement / bullet:
    text?: string;
    metrics?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const SavedContentSchema = new Schema<ISavedContent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['star_story', 'achievement', 'reusable_bullet', 'interview_prep'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SavedContent = mongoose.model<ISavedContent>('SavedContent', SavedContentSchema);

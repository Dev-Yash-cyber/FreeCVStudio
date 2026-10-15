import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    autoSave: boolean;
    defaultPaperSize: 'A4' | 'Letter';
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, default: 'user' },
    isEmailVerified: { type: Boolean, default: true },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      autoSave: { type: Boolean, default: true },
      defaultPaperSize: { type: String, enum: ['A4', 'Letter'], default: 'A4' },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

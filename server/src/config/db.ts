import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('bufferCommands', false);

export const isDbConnected = (): boolean => mongoose.connection.readyState === 1;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/freecvstudio';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error: any) {
    console.warn('⚠️ MongoDB connection not established (' + (error?.message || error) + '). Operating with In-Memory Resilient Engine for Demo and Offline modes.');
  }
};

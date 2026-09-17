import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let isConnected = false;
let connectionError: string | null = null;

export const connectDB = async (): Promise<boolean> => {
  const rawURI = process.env.MONGODB_URI;
  const mongoURI = typeof rawURI === 'string' ? rawURI.trim() : '';

  // Check if URI is provided and has a valid MongoDB scheme
  const isValidScheme =
    mongoURI.startsWith('mongodb://') || mongoURI.startsWith('mongodb+srv://');

  if (!isValidScheme) {
    if (mongoURI.length > 0) {
      console.log('ℹ️  Custom MONGODB_URI does not have a valid "mongodb://" or "mongodb+srv://" prefix. Operating smoothly in embedded storage mode.');
      connectionError = 'Provided connection string is not a valid MongoDB URI. Running in embedded local storage mode.';
    } else {
      console.log('ℹ️  No MONGODB_URI configured. Running in embedded persistent storage mode.');
      connectionError = 'No MONGODB_URI configured. Running in embedded storage mode.';
    }
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    connectionError = null;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.log(`ℹ️  MongoDB connection not reachable (${error.message}). Operating smoothly with embedded storage engine.`);
    isConnected = false;
    connectionError = error.message;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnected,
    mode: isConnected ? 'MongoDB (Atlas / Remote)' : 'Embedded Fallback (Local JSON Persistence)',
    error: connectionError,
    uri: process.env.MONGODB_URI ? 'Configured (Hidden for security)' : 'Not Set',
  };
};

import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

export async function connectToDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });
  console.log('Connected to MongoDB');
}

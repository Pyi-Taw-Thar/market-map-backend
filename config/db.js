import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.DATABASE_URL;

  if (!mongoURI) {
    console.error('Error: MongoDB connection URI is missing!');
    console.error('Please set the MONGODB_URI (or MONGO_URL) environment variable in your environment configuration.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

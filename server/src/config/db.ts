import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(
            process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/fashion_store'
        );
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${(error as Error).message}`);
        process.exit(1);
    }
};
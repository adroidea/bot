import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.development' });

export async function connectDBForTesting() {
    try {
        const dbUri = process.env.MONGO_URI!;
        const dbName = 'test';
        await mongoose.connect(dbUri, {
            dbName,
            autoCreate: true
        });
    } catch (error) {
        console.log('DB connect error');
    }
}

export async function disconnectDBForTesting() {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.log('DB disconnect error');
    }
}

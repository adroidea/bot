import { IJailModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export const jailSchema = new mongoose.Schema<IJailModule>({
    enabled: Boolean,
    jailChannel: String,
    minTime: Number,
    maxTime: Number
});


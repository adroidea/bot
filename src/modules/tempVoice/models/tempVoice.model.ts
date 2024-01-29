import { ITempVoiceModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export const tempVoiceSchema = new mongoose.Schema<ITempVoiceModule>({
    enabled: Boolean,
    hostChannels: [String],
    nameModel: {
        unlocked: String,
        locked: String
    },
    userSettings: Object
});

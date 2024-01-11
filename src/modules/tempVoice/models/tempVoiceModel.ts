import { ITempVoiceModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export const tempVoiceSchema = new mongoose.Schema<ITempVoiceModule>({
    enabled: { type: Boolean, default: true, required: true },
    hostChannels: { type: [String], default: [], required: true },
    nameModel: {
        unlocked: { type: String, default: '🔊 Voc {USERNAME}' },
        locked: { type: String, default: '🔒 Voc {USERNAME}' }
    },
    userSettings: { type: Object, default: {} }
});

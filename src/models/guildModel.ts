import { IGuild } from 'adroi.d.ea';
import { logsSchema } from '../modules/logs/models';
import mongoose from 'mongoose';
import { qotdSchema } from '../modules/qotd/models';
import { tempVoiceSchema } from '../modules/tempVoice/models';
import { twitchSchema } from '../modules/twitch/models';

export interface IEventManagement {
    enabled: boolean;
}

const eventManagementSchema = new mongoose.Schema<IEventManagement>({
    enabled: { type: Boolean, default: false, required: true }
});

const guildSchema = new mongoose.Schema<IGuild>({
    id: {
        type: String,
        required: true
    },
    modules: {
        eventManagement: eventManagementSchema,
        logs: logsSchema,
        qotd: qotdSchema,
        tempVoice: tempVoiceSchema,
        twitchLive: twitchSchema
    }
});

export const GuildModel = mongoose.model<IGuild>('Guild', guildSchema);

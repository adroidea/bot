import { IGuild } from 'adroi.d.ea';
import { auditLogsSchema } from '../modules/auditLogs/models';
import { jailSchema } from '../modules/jail/models';
import mongoose from 'mongoose';
import { qotdSchema } from '../modules/qotd/models';
import { tempVoiceSchema } from '../modules/tempVoice/models';
import { twitchSchema } from '../modules/twitch/models';

export interface IEventManagement {
    enabled: boolean;
}

const eventManagementSchema = new mongoose.Schema<IEventManagement>({
    enabled: Boolean
});

const guildSchema = new mongoose.Schema<IGuild>({
    id: String,
    modules: {
        eventManagement: eventManagementSchema,
        auditLogs: auditLogsSchema,
        jail: jailSchema,
        qotd: qotdSchema,
        tempVoice: tempVoiceSchema,
        twitch: twitchSchema
    }
});

export const GuildModel = mongoose.model<IGuild>('Guild', guildSchema);

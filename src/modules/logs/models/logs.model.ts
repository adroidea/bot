import { ILogsModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export const logsSchema = new mongoose.Schema<ILogsModule>({
    enabled: { type: Boolean, default: false },
    publicLogsChannel: { type: String, default: '' },
    privateLogsChannel: { type: String, default: '' },
    guildMemberAdd: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' },
        ignoreBots: { type: Boolean, default: false }
    },
    guildMemberUpdate: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' },
        ignoreBots: { type: Boolean, default: false }
    },
    guildMemberRemove: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' },
        ignoreBots: { type: Boolean, default: false }
    },
    MessageBulkDelete: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' },
        ignoredChannels: { type: [String], default: [] }
    },
    messageDelete: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' },
        ignoreBots: { type: Boolean, default: false },
        ignoredChannels: { type: [String], default: [] }
    },
    messageUpdate: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' },
        ignoreBots: { type: Boolean, default: false },
        ignoredChannels: { type: [String], default: [] }
    },
    guildBanAdd: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' }
    },
    guildBanRemove: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' }
    },
    guildRoleCreate: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' }
    },
    guildRoleDelete: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' }
    },
    guildRoleUpdate: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' }
    },
    guildUpdate: {
        enabled: { type: Boolean, default: false },
        channelId: { type: String, default: '' }
    }
});

import { IAuditLogsModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

export const auditLogsSchema = new mongoose.Schema<IAuditLogsModule>({
    enabled: Boolean,
    publicLogsChannel: String,
    privateLogsChannel: String,
    guildMemberAdd: {
        enabled: Boolean,
        channelId: String,
        ignoreBots: Boolean
    },
    guildMemberUpdate: {
        enabled: Boolean,
        channelId: String,
        ignoreBots: Boolean,
        ignoredUsers: [String]
    },
    guildMemberRemove: {
        enabled: Boolean,
        channelId: String,
        ignoreBots: Boolean
    },
    messageBulkDelete: {
        enabled: Boolean,
        channelId: String,
        ignoredChannels: [String]
    },
    messageDelete: {
        enabled: Boolean,
        channelId: String,
        ignoreBots: Boolean,
        ignoredChannels: [String],
        ignoredUsers: [String]
    },
    messageUpdate: {
        enabled: Boolean,
        channelId: String,
        ignoreBots: Boolean,
        ignoredChannels: [String],
        ignoredUsers: [String]
    },
    guildBanAdd: {
        enabled: Boolean,
        channelId: String
    },
    guildBanRemove: {
        enabled: Boolean,
        channelId: String
    },
    guildRoleCreate: {
        enabled: Boolean,
        channelId: String
    },
    guildRoleDelete: {
        enabled: Boolean,
        channelId: String
    },
    guildRoleUpdate: {
        enabled: Boolean,
        channelId: String,
        ignoredRoles: [String]
    },
    guildUpdate: {
        enabled: Boolean,
        channelId: String
    },
    botChangeLogs: {
        enabled: Boolean,
        channelId: String
    }
});

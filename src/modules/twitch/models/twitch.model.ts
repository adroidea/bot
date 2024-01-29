import { ITMAlerts, ITMAutoRoles, ITMStreamersData, ITwitchModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

const tmStreamersDataSchema = new mongoose.Schema<ITMStreamersData>({
    streamer: String,
    memberId: String
});

const tmAlertsSchema = new mongoose.Schema<ITMAlerts>({
    enabled: Boolean,
    defaultProfilePicture: String,
    liveProfilePicture: String,
    streamerName: String,
    infoLiveChannel: String,
    pingedRole: String,
    notifyChange: Boolean,
    ignoredCategories: [String],
    message: {
        streamStart: [String],
        gameChange: [String]
    }
});

const tmAutoRolesSchema = new mongoose.Schema<ITMAutoRoles>({
    enabled: Boolean,
    streamingRoleId: String,
    streamers: [tmStreamersDataSchema]
});

export const twitchSchema = new mongoose.Schema<ITwitchModule>({
    enabled: Boolean,
    alerts: tmAlertsSchema,
    autoRoles: tmAutoRolesSchema
});

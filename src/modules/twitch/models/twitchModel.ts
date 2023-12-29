import { ITMAlerts, ITMAutoRoles, ITMStreamersData, ITwitchModule } from 'adroi.d.ea';
import mongoose from 'mongoose';

const tmStreamersDataSchema = new mongoose.Schema<ITMStreamersData>({
    streamer: {
        type: String,
        default: ''
    },
    memberId: {
        type: String,
        default: ''
    }
});

const tmAlertsSchema = new mongoose.Schema<ITMAlerts>({
    enabled: {
        type: Boolean,
        default: false
    },
    defaultProfilePicture: {
        type: String,
        default: ''
    },
    liveProfilePicture: {
        type: String,
        default: ''
    },
    streamerName: {
        type: String,
        default: ''
    },
    infoLiveChannel: {
        type: String,
        default: ''
    },
    pingedRole: {
        type: String,
        default: ''
    }
});

const tmAutoRolesSchema = new mongoose.Schema<ITMAutoRoles>({
    enabled: {
        type: Boolean,
        default: false
    },
    streamingRoleId: {
        type: String,
        default: ''
    },
    streamers: {
        type: [tmStreamersDataSchema],
        default: []
    }
});

export const twitchSchema = new mongoose.Schema<ITwitchModule>({
    enabled: {
        type: Boolean,
        default: false
    },
    alerts: {
        type: tmAlertsSchema,
        default: {}
    },
    autoRoles: {
        type: tmAutoRolesSchema,
        default: {}
    }
});

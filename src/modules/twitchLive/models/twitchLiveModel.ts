import mongoose from 'mongoose';

export interface IStreamersData {
    streamer: string;
    memberId: string;
}

export interface ITwitchLive {
    enabled: boolean;
    defaultProfilePicture?: string;
    liveProfilePicture?: string;
    streamerName: string;
    infoLiveChannel?: string;
    pingedRole?: string;
    streamingRoleId?: string;
    streamers: IStreamersData[];
}

export const twitchLiveSchema = new mongoose.Schema<ITwitchLive>({
    enabled: { type: Boolean, default: false, required: true },
    defaultProfilePicture: { type: String, default: '', required: true },
    liveProfilePicture: { type: String, default: '', required: true },
    streamerName: { type: String, default: 'adan_ea', required: true },
    infoLiveChannel: { type: String, default: '', required: true },
    pingedRole: { type: String, default: '', required: true },
    streamingRoleId: { type: String, default: '', required: true },
    streamers: [
        {
            streamer: String,
            memberId: String
        }
    ]
});

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
    defaultProfilePicture: { type: String, default: '' },
    liveProfilePicture: { type: String, default: '' },
    streamerName: { type: String, default: 'adan_ea' },
    infoLiveChannel: { type: String, default: '' },
    pingedRole: { type: String, default: '' },
    streamingRoleId: { type: String, default: '' },
    streamers: [
        {
            streamer: String,
            memberId: String
        }
    ]
});

import mongoose from "mongoose";

export interface INotifications {
  enabled: boolean;
  publicLogs: {
    enabled: boolean;
    publicLogChannel?: string;
  };
  privateLogs: {
    enabled: boolean;
    privateLogChannel?: string;
    notLoggedChannels?: string[];
  };
  twitchLive: {
    enabled: boolean;
    defaultProfilePicture?: string;
    liveProfilePicture?: string;
    streamerName: string;
    infoLiveChannel?: string;
    pingedRole?: string;
    streamingRoleId?: string;
    streamers?: {
      streamer: string;
      memberId: string;
    }[];
  };
}

const notificationsSchema = new mongoose.Schema<INotifications>({
  enabled: { type: Boolean, default: false },
  publicLogs: {
    enabled: { type: Boolean, default: false },
    publicLogChannel: { type: String, default: "" }
  },
  privateLogs: {
    enabled: { type: Boolean, default: false },
    privateLogChannel: { type: String, default: "" },
    notLoggedChannels: { type: [String], default: [] }
  },
  twitchLive: {
    enabled: { type: Boolean, default: false },
    defaultProfilePicture: { type: String, default: "" },
    liveProfilePicture: { type: String, default: "" },
    streamerName: { type: String, default: "adan_ea" },
    infoLiveChannel: { type: String, default: "" },
    pingedRole: { type: String, default: "" },
    streamingRoleId: { type: String, default: "" },
    streamers: [
      {
        streamer: String,
        memberId: String
      }
    ]
  }
});

export interface ITemporaryVoice {
  enabled: boolean;
  hostChannels?: string[];
  protectedChannels?: string[];
}

const temporaryVoiceSchema = new mongoose.Schema<ITemporaryVoice>({
  enabled: { type: Boolean, default: false },
  hostChannels: { type: [String], default: [] },
  protectedChannels: { type: [String], default: [] }
});

export interface IEventManagement {
  enabled: boolean;
}

const eventManagementSchema = new mongoose.Schema<IEventManagement>({
  enabled: { type: Boolean, default: false }
});

export interface IGuild {
  id: string;
  modules: {
    notifications: INotifications;
    temporaryVoice: ITemporaryVoice;
    eventManagement: IEventManagement;
  };
}

const guildSchema = new mongoose.Schema<IGuild>({
  id: {
    type: String,
    required: true
  },
  modules: {
    notifications: notificationsSchema,
    temporaryVoice: temporaryVoiceSchema,
    eventManagement: eventManagementSchema
  }
});

export const GuildModel = mongoose.model<IGuild>("Guild", guildSchema);

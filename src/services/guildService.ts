import { GuildModel, IGuild } from '../models';
import Logger from '../utils/logger';

const createGuild = async (id: string): Promise<IGuild> => {
    const guild = new GuildModel({
        id,
        modules: {
            notifications: {
                enabled: false,
                publicLogs: {
                    enabled: false,
                    publicLogChannel: ''
                },
                privateLogs: {
                    enabled: false,
                    privateLogChannel: '',
                    notLoggedChannels: []
                }
            },
            qotd: {
                enabled: false,
                channelId: '',
                pingedRoleId: '',
                requestChannelId: '',
                blacklistUsers: [],
                trustedUsers: []
            },
            twitchLive: {
                enabled: false,
                defaultProfilePicture: '',
                liveProfilePicture: '',
                streamerName: 'adan_ea',
                infoLiveChannel: '',
                pingedRole: '',
                streamingRoleId: '',
                streamers: [
                    {
                        streamer: '',
                        memberId: ''
                    }
                ]
            },
            temporaryVoice: {
                enabled: false,
                hostChannels: []
            },
            eventManagement: {
                enabled: false
            }
        }
    });
    await guild.save();
    return guild;
};

const getOrCreateGuild = async (id: string): Promise<IGuild> => {
    try {
        let guildSettings: IGuild | null = await GuildModel.findOne({ id });

        if (!guildSettings) {
            guildSettings = await guildService.createGuild(id);
        }
        return guildSettings;
    } catch (err: any) {
        Logger.error('Error creating or getting guild at getOrCreateGuild()', err);
        throw err;
    }
};

const updateGuild = async (id: string, update: Partial<IGuild>): Promise<IGuild | null> => {
    try {
        const currentGuild = await GuildModel.findOne({ id });

        if (!currentGuild) {
            return createGuild(id);
        }

        const $set: Record<string, any> = {};
        for (const [key, value] of Object.entries(update)) {
            $set[key] = value;
        }

        const updatedGuild = await GuildModel.findOneAndUpdate(
            { id },
            { $set },
            { new: true }
        );

        return updatedGuild;
    } catch (error) {
        console.error('Error updating guild:', error);
        return null;
    }
};

const deleteGuild = async (id: string): Promise<void> => {
    GuildModel.findOneAndDelete({ id });
};

const guildService = {
    createGuild,
    getOrCreateGuild,
    updateGuild,
    deleteGuild
};

export default guildService;

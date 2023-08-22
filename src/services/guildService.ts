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

const updateGuild = async (guildData: IGuild): Promise<IGuild | null> => {
    return GuildModel.findOneAndUpdate({ id: guildData.id }, guildData);
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

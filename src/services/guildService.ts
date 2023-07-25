import { GuildModel, IGuild } from '../models';

async function createGuild(id: string): Promise<IGuild> {
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
                requestChannelId: ''
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
}

async function getGuildById(id: string): Promise<IGuild | null> {
    return GuildModel.findOne({ id });
}

async function updateGuild(guildData: IGuild): Promise<void> {
    /**
     * @TODO : implement this
     */
    console.log(guildData);
}

async function deleteGuild(guildId: string): Promise<void> {
    /**
     * @TODO : implement this
     */
    await GuildModel.findByIdAndDelete({ guildId });
}

const guildService = {
    createGuild,
    getGuildById,
    updateGuild,
    deleteGuild
};

export default guildService;

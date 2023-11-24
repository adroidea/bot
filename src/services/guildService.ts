import { GuildModel, IGuild } from '../models';
import Logger from '../utils/logger';

/**
 * Creates a new guild with the specified ID.
 * @param id The ID of the guild.
 * @returns A Promise that resolves to the created guild.
 */
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
                hostChannels: [],
                nameModel: {
                    unlocked: "🔊 Vocal {USERNAME}",
                    locked: "🔒 Vocal {USERNAME}"
                },
                userSettings: {}
            },
            eventManagement: {
                enabled: false
            }
        }
    });
    await guild.save();
    return guild;
};

/**
 * Retrieves an existing guild or creates a new one based on the provided ID.
 * @param id The ID of the guild.
 * @returns A promise that resolves to the retrieved or created guild.
 * @throws If there is an error creating or getting the guild.
 */
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

/**
 * Updates a guild with the specified ID.
 * If the guild does not exist, a new guild will be created.
 * @param id - The ID of the guild to update.
 * @param update - The partial guild object containing the fields to update.
 * @returns A promise that resolves to the updated guild object, or null if an error occurs.
 */
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

/**
 * Deletes a guild by its ID.
 * @param {string} id - The ID of the guild to delete.
 * @returns {Promise<void>} - A promise that resolves when the guild is deleted.
 */
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

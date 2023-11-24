import { Client, Events, VoiceBasedChannel, VoiceState } from 'discord.js';
import {
    createNewTempChannel,
    deleteEmptyChannel,
    switchVoiceOwner
} from '../../../../utils/voiceUtil';
import { IGuild } from '../../../../models';
import { client } from '../../../..';
import guildService from '../../../../services/guildService';

/**
 * Checks if a voice channel is temporary.
 * @param voiceId - The ID of the voice channel.
 * @returns True if the voice channel is temporary, false otherwise.
 */
const isTempVoice = (voiceId: string): boolean => {
    return client.tempVoice.has(voiceId);
};

/**
 * Checks if a voiceId is included in the hostC array.
 * @param hostC - The array of host voiceIds.
 * @param voiceId - The voiceId to check.
 * @returns - True if the voiceId is included in the hostC array, false otherwise.
 */
const isHostVoice = (hostC: string[], voiceId: string): boolean => {
    return hostC.includes(voiceId);
};

/**
 * Determines the type of voice update based on the old and new voice channels.
 * @param oldC The old voice channel.
 * @param newC The new voice channel.
 * @returns The type of voice update: 'JOINED_VOICE', 'LEFT_VOICE', 'MOVED_VOICE', or an empty string.
 */
const getVoiceUpdateType = (
    oldC: VoiceBasedChannel | null,
    newC: VoiceBasedChannel | null
): string => {
    if (!oldC && newC) return 'JOINED_VOICE';
    else if (oldC && !newC) return 'LEFT_VOICE';
    else if (oldC && newC && oldC.id !== newC.id) return 'MOVED_VOICE';
    return '';
};

export default {
    name: Events.VoiceStateUpdate,
    async execute(client: Client, oldState: VoiceState, newState: VoiceState) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(newState.guild.id);

        const { temporaryVoice } = guildSettings.modules;
        if (!temporaryVoice.enabled) return;

        const hostC = temporaryVoice?.hostChannels ?? [''];

        try {
            const voiceUpdateType = getVoiceUpdateType(oldState.channel, newState.channel);

            switch (voiceUpdateType) {
                case 'JOINED_VOICE':
                    if (isHostVoice(hostC, newState.channelId!)) {
                        await createNewTempChannel(newState, temporaryVoice);
                    }
                    break;

                case 'MOVED_VOICE':
                case 'LEFT_VOICE':
                    if (isTempVoice(oldState.channelId!)) {
                        await deleteEmptyChannel(oldState.channel!);
                        const member = oldState.channel?.members.first();
                        if (member)
                            await switchVoiceOwner(oldState.member!, member, temporaryVoice);
                    }
                    if (
                        voiceUpdateType === 'MOVED_VOICE' &&
                        isHostVoice(hostC, newState.channelId!)
                    ) {
                        await createNewTempChannel(newState, temporaryVoice);
                    }
                    break;

                default:
                    break;
            }
        } catch (err: any) {
            console.log(err);
            console.log('An error occurred while updating voice state');
        }
    }
};

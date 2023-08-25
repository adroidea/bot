import { Client, Events, VoiceBasedChannel, VoiceState } from 'discord.js';
import {
    createNewTempChannel,
    deleteEmptyChannel,
    switchVoiceOwner
} from '../../../../utils/voiceUtil';
import { IGuild } from '../../../../models';
import guildService from '../../../../services/guildService';

const isProtectedVoice = (hostC: string[], protectedC: string[], voiceId: string): boolean => {
    return isHostVoice(hostC, voiceId) || protectedC.includes(voiceId);
};

const isHostVoice = (hostC: string[], voiceId: string): boolean => {
    return hostC.includes(voiceId);
};

const getVoiceUpdateType = (
    oldC: VoiceBasedChannel | null,
    newC: VoiceBasedChannel | null
): string => {
    if (!oldC && newC) return 'JOINED_VOICE';
    else if (oldC && !newC) return 'LEFT_VOICE';
    else if (oldC && newC && oldC.id !== newC.id) return 'MOVED_VOICE';
    return '';
};

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(client: Client, oldState: VoiceState, newState: VoiceState) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(newState.guild.id);

        const { temporaryVoice } = guildSettings.modules;
        if (!temporaryVoice.enabled) return;

        const hostC = temporaryVoice?.hostChannels ?? [''];
        const protectedC = temporaryVoice?.protectedChannels ?? [''];

        const voiceUpdateType = getVoiceUpdateType(oldState.channel, newState.channel);

        switch (voiceUpdateType) {
            case 'JOINED_VOICE':
                if (isHostVoice(hostC, newState.channelId!)) {
                    await createNewTempChannel(newState);
                }
                break;

            case 'MOVED_VOICE':
            case 'LEFT_VOICE':
                if (!isProtectedVoice(hostC, protectedC, oldState.channelId!)) {
                    await deleteEmptyChannel(oldState.channel!);
                    const member = oldState.channel?.members.first();
                    if (member) await switchVoiceOwner(oldState.member!, member);
                }
                if (voiceUpdateType === 'MOVED_VOICE' && isHostVoice(hostC, newState.channelId!)) {
                    await createNewTempChannel(newState);
                }
                break;

            default:
                break;
        }
    }
};

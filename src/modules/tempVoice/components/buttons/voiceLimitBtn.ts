import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { client } from '../../../..';
import { voiceLimitModal } from '../modals/voiceLimitModal';

export const voiceLimitBtn = new ButtonBuilder()
    .setCustomId('voiceLimitBtn')
    .setEmoji('📶')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceLimitBtn`
    },
    cooldown: 120,
    async execute(interaction: ButtonInteraction) {
        const ownerId = client.tempVoice.get(interaction.channelId!)?.ownerId; 
        if (ownerId !== interaction.user.id) throw CustomErrors.NotVoiceOwnerError;
        interaction.showModal(voiceLimitModal);
    }
};

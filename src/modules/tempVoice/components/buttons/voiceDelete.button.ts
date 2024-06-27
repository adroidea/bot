import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import client from '../../../../client';
import { voiceDeleteActionRow } from './voiceDeleteConfirm.button';

export const voiceDeleteBtn = new ButtonBuilder()
    .setCustomId('voiceDeleteBtn')
    .setEmoji('🚮')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceDeleteBtn`
    },
    async execute(interaction: ButtonInteraction) {
        const ownerId = client.tempVoice.get(interaction.channelId!)?.ownerId;
        if (ownerId !== interaction.user.id) throw CustomErrors.NotVoiceOwnerError;
        interaction.reply({
            content: 'Es-tu sûr de vouloir supprimer ce salon ?',
            components: [voiceDeleteActionRow],
            ephemeral: true
        });
    }
};

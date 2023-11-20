import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { voiceTrustRow } from '../selectMenus';

export const voiceTrustBtn = new ButtonBuilder()
    .setCustomId('voiceTrustBtn')
    .setEmoji('🤝')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceTrustBtn`
    },
    async execute(interaction: ButtonInteraction) {
        return interaction.reply({
            components: [voiceTrustRow],
            ephemeral: true
        });
    }
};

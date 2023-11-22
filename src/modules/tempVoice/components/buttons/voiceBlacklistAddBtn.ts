import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { voiceBlacklistAddRow } from '../selectMenus';

export const voiceBlacklistAddBtn = new ButtonBuilder()
    .setCustomId('voiceBlacklistAddBtn')
    .setEmoji('📕')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceBlacklistAddBtn`
    },
    async execute(interaction: ButtonInteraction) {
        
        return interaction.reply({
            components: [voiceBlacklistAddRow],
            ephemeral: true
        });
    }
};

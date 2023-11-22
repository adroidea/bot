import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { voiceWhitelistAddRow } from '../selectMenus';

export const voiceWhitelistAddBtn = new ButtonBuilder()
    .setCustomId('voiceWhitelistAddBtn')
    .setEmoji('📗')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceWhitelistAddBtn`
    },
    async execute(interaction: ButtonInteraction) {
        return interaction.reply({
            components: [voiceWhitelistAddRow],
            ephemeral: true
        });
    }
};

import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { voiceWhitelistTempAddRow } from '../selectMenus';

export const voiceWhitelistTempAddBtn = new ButtonBuilder()
    .setCustomId('voiceWhitelistTempAddBtn')
    .setEmoji('<:tempWL:1177705708628746250>')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceWhitelistTempAddBtn`
    },
    async execute(interaction: ButtonInteraction) {
        return interaction.reply({
            components: [voiceWhitelistTempAddRow],
            ephemeral: true
        });
    }
};

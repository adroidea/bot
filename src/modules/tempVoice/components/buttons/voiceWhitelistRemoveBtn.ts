import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const voiceWhitelistRemoveBtn = new ButtonBuilder()
    .setCustomId('voiceWhitelistRemoveBtn')
    .setEmoji('👐')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceWhitelistRemoveBtn`
    },
    async execute(interaction: ButtonInteraction) {
        console.log(interaction.user.username);
    }
};

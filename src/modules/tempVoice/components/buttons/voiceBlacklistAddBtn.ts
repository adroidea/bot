import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const voiceBlacklistAddBtn = new ButtonBuilder()
    .setCustomId('voiceBlacklistAddBtn')
    .setEmoji('📕')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceBlacklistAddBtn`
    },
    async execute(interaction: ButtonInteraction) {
        console.log(interaction.user.username);
    }
};

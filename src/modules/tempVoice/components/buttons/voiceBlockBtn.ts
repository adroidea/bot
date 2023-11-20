import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const voiceBlockBtn = new ButtonBuilder()
    .setCustomId('voiceBlockBtn')
    .setEmoji('🛑')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceBlockBtn`
    },
    async execute(interaction: ButtonInteraction) {
        console.log(interaction.user.username);
    }
};

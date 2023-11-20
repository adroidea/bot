import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const voiceUnblockBtn = new ButtonBuilder()
    .setCustomId('voiceUnblockBtn')
    .setEmoji('⭕')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceUnblockBtn`
    },
    async execute(interaction: ButtonInteraction) {
        console.log(interaction.user.username);
    }
};

import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const voiceBlacklistRemoveBtn = new ButtonBuilder()
    .setCustomId('voiceBlacklistRemoveBtn')
    .setEmoji('📤')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceBlacklistRemoveBtn`
    },
    async execute(interaction: ButtonInteraction) {
        console.log(interaction.user.username);
    }
};

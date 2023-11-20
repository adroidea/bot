import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

export const voiceUntrustBtn = new ButtonBuilder()
    .setCustomId('voiceUntrustBtn')
    .setEmoji('👐')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voiceUntrustBtn`
    },
    async execute(interaction: ButtonInteraction) {
        console.log(interaction.user.username);
    }
};

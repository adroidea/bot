import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    GuildMember
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { isMemberVoiceOwner } from '../../../../utils/voice.util';

export const voiceDeleteActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('voiceDeleteConfirmBtn')
        .setEmoji('🗑')
        .setStyle(ButtonStyle.Danger)
);

export default {
    data: {
        name: `voiceDeleteConfirmBtn`
    },
    cooldown: 600,
    async execute(interaction: ButtonInteraction) {
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || !isMemberVoiceOwner(member.id, voiceChannel.id))
            throw CustomErrors.NotVoiceOwnerError;

        interaction.reply({
            content: 'Au revoir !',
            ephemeral: true
        });

        await voiceChannel.delete();
    }
};

import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import {
    checkVoiceOwnership,
    checkVoicePrivacy,
    switchVoicePrivacy
} from '../../../../utils/voiceUtil';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from '../../../../models';

export const voicePrivacyBtn = new ButtonBuilder()
    .setCustomId('voicePrivacyBtn')
    .setEmoji('🔐')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voicePrivacyBtn`
    },
    cooldown: 10,
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || !(await checkVoiceOwnership(voiceChannel.id, member.id)))
            throw CustomErrors.NotVoiceOwnerError;

        await interaction.deferReply({ ephemeral: true });
        let isPublic: boolean = checkVoicePrivacy(voiceChannel.id);

        switchVoicePrivacy(member, guildSettings.modules.temporaryVoice.nameModel);
        await interaction.editReply({
            content: `Le salon est maintenant ${isPublic ? 'privé' : 'public'}.`
        });
    }
};

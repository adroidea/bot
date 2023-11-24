import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import {
    isMemberVoiceOwner,
    isVoicePrivate,
    switchVoicePrivacy
} from '../../../../utils/voiceUtil';
import { CustomErrors } from '../../../../utils/errors';
import { IGuild } from '../../../../models';
import { getorCreateUserSettings } from '../../../../utils/modulesUil';

export const voicePrivacyBtn = new ButtonBuilder()
    .setCustomId('voicePrivacyBtn')
    .setEmoji('🔐')
    .setStyle(ButtonStyle.Secondary);

export default {
    data: {
        name: `voicePrivacyBtn`
    },
    cooldown: 300,
    async execute(interaction: ButtonInteraction, guildSettings: IGuild) {
        getorCreateUserSettings(interaction.user.id, guildSettings);
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || !isMemberVoiceOwner(member.id, voiceChannel.id))
            throw CustomErrors.NotVoiceOwnerError;

        await interaction.deferReply({ ephemeral: true });
        let isPublic: boolean = isVoicePrivate(voiceChannel.id);

        switchVoicePrivacy(member, guildSettings.modules.temporaryVoice.nameModel);
        await interaction.editReply({
            content: `Le salon est maintenant ${isPublic ? 'privé' : 'public'}.`
        });
    }
};

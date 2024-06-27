import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember } from 'discord.js';
import { isMemberVoiceOwner, switchVoicePrivacy } from '../../../../utils/voice.util';
import { CustomErrors } from '../../../../utils/errors';
import { Embed } from '../../../../utils/embeds.util';
import { IGuild } from 'adroi.d.ea';
import { getorCreateUserSettings } from '../../../../utils/modules.uil';

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
        getorCreateUserSettings(interaction.member as GuildMember, guildSettings);
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || !isMemberVoiceOwner(member.id, voiceChannel.id))
            throw CustomErrors.NotVoiceOwnerError;

        const isPrivate: boolean | undefined = await switchVoicePrivacy(
            member,
            guildSettings.modules.tempVoice.nameModel
        );
        const embed = Embed.success(`Le salon est maintenant ${isPrivate ? 'privé' : 'public'}.`);
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

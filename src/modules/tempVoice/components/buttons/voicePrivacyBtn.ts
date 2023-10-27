import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    GuildMember
} from 'discord.js';
import {
    checkVoiceOwnership,
    checkVoicePrivacy,
    switchVoicePrivacy
} from '../../../../utils/voiceUtil';
import { CustomErrors } from '../../../../utils/errors';
import { voiceOwnerTransferBtn } from './';

export const voicePrivacyBtn = new ButtonBuilder()
    .setCustomId('voicePrivacyBtn')
    .setLabel('Vérouiller')
    .setEmoji('🔒')
    .setStyle(ButtonStyle.Primary);

export default {
    data: {
        name: `voicePrivacyBtn`
    },
    async execute(interaction: ButtonInteraction) {
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel || !(await checkVoiceOwnership(voiceChannel, member)))
            throw CustomErrors.NotVoiceOwnerError;

        let isPublic: boolean = await checkVoicePrivacy(voiceChannel);

        const newButton = new ButtonBuilder()
            .setCustomId('voicePrivacyBtn')
            .setLabel(isPublic ? 'Déverrouiller' : 'Verrouiller')
            .setEmoji(isPublic ? '🔓' : '🔒')
            .setStyle(isPublic ? ButtonStyle.Success : ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            newButton,
            voiceOwnerTransferBtn
        );

        switchVoicePrivacy(member);
        await interaction.update({ components: [row] });
    }
};

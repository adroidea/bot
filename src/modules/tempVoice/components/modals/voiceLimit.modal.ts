import {
    ActionRowBuilder,
    GuildMember,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalMessageModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { setVoiceLimit } from '../../../../utils/voice.util';

export const voiceLimitModal = new ModalBuilder()
    .setCustomId('voiceLimitModal')
    .setTitle("Limite d'utisiateurs dans le salon")
    .addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId('LimitThresholdInput')
                .setLabel("Nombre d'utilisateurs (0-99)")
                .setPlaceholder('0 ou vide pour désactiver')
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
        )
    );

export default {
    data: {
        name: `voiceLimitModal`
    },
    async execute(interaction: ModalMessageModalSubmitInteraction) {
        const member = interaction.member as GuildMember;
        const memberVoiceChannel = member.voice.channel;

        if (!memberVoiceChannel) {
            throw CustomErrors.NotVoiceOwnerError;
        }

        const voiceChannel = await interaction.guild!.channels.fetch(memberVoiceChannel.id);
        if (!voiceChannel!.isVoiceBased()) throw CustomErrors.NotVoiceChannelError;

        setVoiceLimit(interaction, voiceChannel);
    }
};

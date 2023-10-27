import {
    ActionRowBuilder,
    ButtonInteraction,
    GuildMember,
    StringSelectMenuBuilder
} from 'discord.js';
import { CustomErrors } from '../../../../utils/errors';
import { checkVoiceOwnership } from '../../../../utils/voiceUtil';

export default {
    data: {
        name: `voiceOwnerTransferBtn`
    },
    async execute(interaction: ButtonInteraction) {
        const voiceChannel = (interaction.member as GuildMember)!.voice.channel;

        const member = interaction.member as GuildMember;

        if (!voiceChannel || !(await checkVoiceOwnership(voiceChannel, member)))
            throw CustomErrors.NotVoiceOwnerError;

        const members = voiceChannel.members.map(member => {
            return {
                label: member.user.username,
                value: member.id
            };
        });

        if (voiceChannel.members.size === 1) {
            return interaction.reply({
                content:
                    'https://tenor.com/view/no-i-dont-think-i-will-captain-america-old-capt-gif-17162888',
                ephemeral: true
            });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('voiceOwnerTransferMenu')
            .setPlaceholder('Choisir le nouveau propriétaire')
            .addOptions(members.filter(member => member.value !== interaction.member?.user.id));

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
        return interaction.reply({
            content: 'Un grand pouvoir implique de grandes responsabilités :',
            ephemeral: true,
            components: [row]
        });
    }
};

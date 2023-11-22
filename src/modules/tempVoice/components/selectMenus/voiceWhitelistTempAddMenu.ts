import {
    ActionRowBuilder,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { formatCustomList } from '../../../../utils/embedsUtil';

const selectMenu = new UserSelectMenuBuilder()
    .setCustomId('voiceWhitelistTempAddMenu')
    .setPlaceholder('Autorisation temporaire pour ces utilisateurs')
    .setMinValues(0)
    .setMaxValues(25);

export const voiceWhitelistTempAddRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
    selectMenu
);

export default {
    data: {
        name: `voiceWhitelistTempAddMenu`
    },
    async execute(interaction: UserSelectMenuInteraction) {
        await interaction.deferUpdate();

        const TempTrustedUsers = interaction.users
            .filter(user => user.id !== interaction.user.id)
            .map(user => user.id);

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        for (const userId of TempTrustedUsers) {
            if (voiceChannel) {
                const isWhitelisted = voiceChannel.permissionOverwrites.cache
                    .get(userId)
                    ?.allow.has([
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.ViewChannel
                    ]);

                if (!isWhitelisted) {
                    await voiceChannel.permissionOverwrites.edit(userId, {
                        ViewChannel: true,
                        Connect: true,
                        Speak: true
                    });
                }
            }
        }

        const newEmbed = new EmbedBuilder()
            .setTitle('Utilisateurs sont whitelisté pour ce salon temporaire')
            .setDescription(formatCustomList(TempTrustedUsers, 'user'))
            .setColor(Colors.random);

        return interaction.update({
            embeds: [newEmbed],
            components: []
        });
    }
};

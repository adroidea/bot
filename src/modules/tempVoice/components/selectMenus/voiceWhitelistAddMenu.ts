import {
    ActionRowBuilder,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IGuild } from 'adroi.d.ea';
import { formatCustomList } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guildService';

const selectMenu = new UserSelectMenuBuilder()
    .setCustomId('voiceWhitelistAddMenu')
    .setPlaceholder('Autorisation pour ces utilisateurs')
    .setMinValues(0)
    .setMaxValues(25);

export const voiceWhitelistAddRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
    selectMenu
);

export default {
    data: {
        name: `voiceWhitelistAddMenu`
    },
    async execute(interaction: UserSelectMenuInteraction, guildSettings: IGuild) {
        await interaction.deferUpdate();
        const { trustedUsers, blockedUsers } =
            guildSettings.modules.tempVoice.userSettings[interaction.user.id];
        const newTrustedUsers = interaction.users
            .filter(user => user.id !== interaction.user.id)
            .map(user => user.id);

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        for (const userId of newTrustedUsers) {
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

            if (!trustedUsers.includes(userId)) {
                trustedUsers.push(userId);
                if (blockedUsers.includes(userId)) {
                    blockedUsers.splice(blockedUsers.indexOf(userId), 1);
                }
            }
        }

        guildService.updateGuild(interaction.guild!, {
            [`modules.tempVoice.userSettings.${interaction.user.id}.trustedUsers`]:
                newTrustedUsers,
            [`modules.tempVoice.userSettings.${interaction.user.id}.blockedUsers`]:
                blockedUsers
        });

        const newEmbed = new EmbedBuilder()
            .setTitle('Utilisateurs ajoutés')
            .setDescription(formatCustomList(newTrustedUsers, 'user'))
            .setColor(Colors.random);

        return interaction.editReply({
            embeds: [newEmbed],
            components: []
        });
    }
};

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
import { client } from '../../../..';
import { formatCustomList } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guild.service';

const selectMenu = new UserSelectMenuBuilder()
    .setCustomId('voiceBlacklistAddMenu')
    .setPlaceholder('Interdiction pour ces utilisateurs')
    .setMinValues(0)
    .setMaxValues(25);

export const voiceBlacklistAddRow = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
    selectMenu
);

export default {
    data: {
        name: `voiceBlacklistAddMenu`
    },
    async execute(interaction: UserSelectMenuInteraction, guildSettings: IGuild) {
        await interaction.deferUpdate();
        const { trustedUsers, blockedUsers } =
            guildSettings.modules.tempVoice.userSettings[interaction.user.id];
        const newBLUsers = interaction.users
            .filter(user => user.id !== interaction.user.id && user.id !== client.user!.id)
            .map(user => user.id);

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        for (const userId of newBLUsers) {
            if (voiceChannel) {
                const isBlacklisted = voiceChannel.permissionOverwrites.cache
                    .get(userId)
                    ?.deny.has([
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.ViewChannel
                    ]);

                if (!isBlacklisted) {
                    await voiceChannel.permissionOverwrites.edit(userId, {
                        ViewChannel: false,
                        Connect: false,
                        Speak: false
                    });
                }

                const target = voiceChannel.members.get(userId);

                if (target && !target.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    await target.voice.disconnect();
                }
            }

            if (!blockedUsers.includes(userId)) {
                blockedUsers.push(userId);
                if (trustedUsers.includes(userId)) {
                    trustedUsers.splice(trustedUsers.indexOf(userId), 1);
                }
            }
        }

        guildService.updateGuild(interaction.guild!, {
            [`modules.tempVoice.userSettings.${interaction.user.id}.trustedUsers`]:
                trustedUsers,
            [`modules.tempVoice.userSettings.${interaction.user.id}.blockedUsers`]: newBLUsers
        });

        const newEmbed = new EmbedBuilder()
            .setTitle('Utilisateurs bloqués')
            .setDescription(formatCustomList(newBLUsers, 'user'))
            .setColor(Colors.random);

        return interaction.editReply({
            embeds: [newEmbed],
            components: []
        });
    }
};

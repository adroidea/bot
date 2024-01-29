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

        const { user } = interaction;
        const { trustedUsers, blockedUsers } =
            guildSettings.modules.tempVoice.userSettings[user.id];
        const newBLUsers = interaction.users
            .filter(u => u.id !== user.id && u.id !== client.user!.id)
            .map(u => u.id);

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        const promises = newBLUsers.map(async userId => {
            if (voiceChannel) {
                const overwrite = voiceChannel.permissionOverwrites.cache.get(userId);

                if (
                    overwrite &&
                    !overwrite.deny.has([
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.ViewChannel
                    ])
                ) {
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

                const trustedIndex = trustedUsers.indexOf(userId);
                if (trustedIndex !== -1) {
                    trustedUsers.splice(trustedIndex, 1);
                }
            }
        });

        await Promise.all(promises);

        guildService.updateGuild(interaction.guild!, {
            [`modules.tempVoice.userSettings.${user.id}.trustedUsers`]: trustedUsers,
            [`modules.tempVoice.userSettings.${user.id}.blockedUsers`]: newBLUsers
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

import {
    ActionRowBuilder,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    StringSelectMenuBuilder,
    User,
    UserSelectMenuInteraction
} from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IGuild } from 'adroi.d.ea';
import { client } from '../../../..';
import { formatCustomList } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guild.service';

const buildSelectMenu = (users: string[]) => {
    const usersData: User[] = users
        .map(user => client.users.cache.get(user))
        .filter(user => user !== undefined);

    return new StringSelectMenuBuilder()
        .setCustomId('voiceBlacklistRemoveMenu')
        .setPlaceholder("Lever l'interdiction de ces utilisateurs")
        .addOptions(
            usersData.map((user: User) => ({
                label: user.username,
                value: user.id,
                emoji: user.bot ? '🤖' : '👤'
            }))
        )
        .setMinValues(1)
        .setMaxValues(usersData.length);
};

/**
 * Builds an ActionRow containing a StringSelectMenu for removing users from the voice blacklist.
 * @param users - An array of strings representing the users to be removed.
 * @returns An ActionRowBuilder containing the StringSelectMenu.
 */
export const buildVoiceBlacklistRemoveRow = (users: string[]) => {
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(buildSelectMenu(users));
};

export default {
    data: {
        name: `voiceBlacklistRemoveMenu`
    },
    async execute(interaction: UserSelectMenuInteraction, guildSettings: IGuild) {
        await interaction.deferUpdate();
        const { blockedUsers } =
            guildSettings.modules.tempVoice.userSettings[interaction.user.id];
        const selectedUserIds = interaction.values;

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        for (const userId of selectedUserIds) {
            if (voiceChannel) {
                const isBlacklisted = voiceChannel.permissionOverwrites.cache
                    .get(userId)
                    ?.deny.has([
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.ViewChannel
                    ]);

                if (isBlacklisted) {
                    await voiceChannel.permissionOverwrites.delete(userId);
                }
            }

            if (blockedUsers.includes(userId)) {
                blockedUsers.splice(blockedUsers.indexOf(userId), 1);
            }
        }

        guildService.updateGuild(interaction.guild!, {
            [`modules.tempVoice.userSettings.${interaction.user.id}.blockedUsers`]:
                blockedUsers
        });

        const newEmbed = new EmbedBuilder()
            .setTitle('Utilisateurs retirés de la whitelist')
            .setDescription(formatCustomList(selectedUserIds, 'user'))
            .setColor(Colors.random);

        return interaction.editReply({
            embeds: [newEmbed],
            components: []
        });
    }
};

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
import { client } from '../../../../..';
import { formatCustomList } from '../../../../utils/embedsUtil';
import guildService from '../../../../services/guild.service';

const buildSelectMenu = (users: string[]) => {
    const usersData: User[] = users
        .map(user => client.users.cache.get(user))
        .filter(user => user !== undefined);

    return new StringSelectMenuBuilder()
        .setCustomId('voiceWhitelistRemoveMenu')
        .setPlaceholder("Lever l'autorisation de ces utilisateurs")
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

export const buildVoiceWhitelistRemoveRow = (users: string[]) => {
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(buildSelectMenu(users));
};
export default {
    data: {
        name: `voiceWhitelistRemoveMenu`
    },
    async execute(interaction: UserSelectMenuInteraction, guildSettings: IGuild) {
        await interaction.deferUpdate();
        const { trustedUsers } = guildSettings.modules.tempVoice.userSettings[interaction.user.id];
        const selectedUserIds = interaction.values;
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        for (const userId of selectedUserIds) {
            if (voiceChannel) {
                const isWhitelisted = voiceChannel.permissionOverwrites.cache
                    .get(userId)
                    ?.allow.has([
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.ViewChannel
                    ]);

                if (isWhitelisted) {
                    await voiceChannel.permissionOverwrites.edit(userId, {
                        ViewChannel: null,
                        Connect: null,
                        Speak: null
                    });
                }
            }

            if (trustedUsers.includes(userId)) {
                trustedUsers.splice(trustedUsers.indexOf(userId), 1);
            }
        }

        guildService.updateGuild(interaction.guild!, {
            [`modules.tempVoice.userSettings.${interaction.user.id}.trustedUsers`]:
                trustedUsers
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

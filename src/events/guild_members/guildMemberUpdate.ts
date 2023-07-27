import { Client, Events, GuildMember, TextChannel, userMention } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import { IGuild } from '../../models';
import guildService from '../../services/guildService';

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(client: Client, oldMember: GuildMember, newMember: GuildMember) {
        let guildSettings: IGuild | null = await guildService.getGuildById(newMember.guild.id);
        if (!guildSettings) {
            guildSettings = await guildService.createGuild(newMember.guild.id);
        }

        if (
            !guildSettings.modules.notifications.enabled &&
            !guildSettings.modules.notifications.privateLogs.enabled
        )
            return;

        const moduleSettings = guildSettings.modules.notifications.privateLogs;
        const registeredLogChannel = moduleSettings.privateLogChannel;

        if (!registeredLogChannel) {
            return;
        }

        const logChannel = client.channels.cache.get(registeredLogChannel);

        if (logChannel) {
            if (oldMember.nickname !== newMember.nickname) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${newMember.user.username}`,
                        iconURL: newMember.avatarURL()!
                    })
                    .setDescription(`${userMention(newMember.id)} a changé de pseudo`)
                    .addFields([
                        {
                            name: 'Ancien',
                            value: oldMember.nickname ?? oldMember.user.username,
                            inline: false
                        },
                        {
                            name: 'Nouveau',
                            value: newMember.nickname ?? newMember.user.username,
                            inline: false
                        }
                    ])
                    .setFooter({ text: `ID: ${newMember.id}` })
                    .setColor([186, 45, 250])
                    .setTimestamp();

                await (logChannel as TextChannel).send({ embeds: [embed] });
            }
        }
    }
};

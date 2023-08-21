import { Client, Events, GuildMember, TextChannel, userMention } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';
import guildService from '../../../../services/guildService';
import { isNotifSMEnabled } from '../../../../utils/modulesUil';

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(client: Client, oldMember: GuildMember, newMember: GuildMember) {
        const {
            modules: { notifications }
        } = await guildService.getOrCreateGuild(newMember.guild.id);
        if (!isNotifSMEnabled(notifications, 'privateLogs')) return;
        const { privateLogs } = notifications;

        const registeredLogChannel = privateLogs.privateLogChannel;

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

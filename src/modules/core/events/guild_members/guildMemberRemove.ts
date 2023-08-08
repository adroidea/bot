import { Client, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { IGuild } from '../../../../models';
import guildService from '../../../../services/guildService';
import { timestampToDate } from '../../../../utils/botUtil';

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client: Client, member: GuildMember) {
        const guildSettings: IGuild = await guildService.getorCreateGuild(member.guild.id);

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

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.id}`,
                iconURL: member.user.avatarURL()!
            })
            .setThumbnail(
                'https://cdn.discordapp.com/attachments/779901444408606730/918202331743539200/unknown.png'
            )
            .setTitle(`${member.user.username} nous a quitté!`)
            .setDescription(`Weaklings Die. Big Deal.`)
            .addFields(
                {
                    name: '❄ Création :',
                    value: `<t:${timestampToDate(member.user.createdTimestamp)}:R>`,
                    inline: true
                },
                {
                    name: '❄ Rejoint :',
                    value: `<t:${timestampToDate(member.joinedTimestamp!)}:R>`,
                    inline: true
                },
                {
                    name: '❄ Nombre de membres :',
                    value: `${member.guild.memberCount}`,
                    inline: false
                }
            )
            .setFooter({
                text: 'So long partner.',
                iconURL: member.user.avatarURL()!
            })
            .setTimestamp()
            .setColor(Colors.random);
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

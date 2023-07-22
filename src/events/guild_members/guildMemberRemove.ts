import { Client, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { Colors } from '../../utils/consts';
import { CustomErrors } from '../../utils/errors';
import { IGuild } from '../../models';
import guildService from '../../services/guildService';

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client: Client, member: GuildMember) {
        let guildSettings: IGuild | null = await guildService.getGuildById(member.guild.id);
        if (!guildSettings) {
            guildSettings = await guildService.createGuild(member.guild.id);
        }

        if (
            !guildSettings.modules.notifications.enabled &&
            !guildSettings.modules.notifications.publicLogs.enabled
        )
            throw CustomErrors.ModuleNotEnabledError;

        const moduleSettings = guildSettings.modules.notifications.publicLogs;
        const registeredLogChannel = moduleSettings.publicLogChannel;

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
                    value: `<t:${member.user.createdTimestamp / 1000}:R>`,
                    inline: true
                },
                {
                    name: '❄ Rejoint :',
                    value: `<t:${member.joinedTimestamp! / 1000}:R>`,
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

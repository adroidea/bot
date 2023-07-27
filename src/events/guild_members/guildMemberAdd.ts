import { Client, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { Colors } from '../../utils/consts';
import { IGuild } from '../../models';
import guildService from '../../services/guildService';

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client: Client, member: GuildMember) {
        let guildSettings: IGuild | null = await guildService.getGuildById(member.guild.id);
        if (!guildSettings) {
            guildSettings = await guildService.createGuild(member.guild.id);
        }

        if (
            !guildSettings.modules.notifications.enabled &&
            !guildSettings.modules.notifications.publicLogs.enabled
        )
            return;

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
            .setThumbnail(member.user.avatarURL())
            .setTitle(
                `<a:pikaHi:960872476718551070> Bienvenue sur le serveur ${member.user.username} !`
            )
            .setDescription(
                `Bonjour à toi ! Nous souhaitons que ton expérience parmi nous soit aussi plaisante que possible, et nous nous y emploierons constamment.`
            )
            .addFields({
                name: '❄ Création :',
                value: `<t:${member.user.createdTimestamp / 1000}:R>`,
                inline: true
            })
            .setFooter({
                text: "T'es vraiment bg tu sais ?"
            })
            .setTimestamp()
            .setColor(Colors.random);
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

import { Client, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { Colors } from '../../../../utils/consts';
import guildService from '../../../../services/guildService';
import { isNotifSMEnabled } from '../../../../utils/modulesUil';
import { timestampToDate } from '../../../../utils/botUtil';

export default {
    name: Events.GuildMemberAdd,
    async execute(client: Client, member: GuildMember) {
        const {
            modules: { notifications }
        } = await guildService.getOrCreateGuild(member.guild.id);
        if (!isNotifSMEnabled(notifications, 'publicLogs')) return;

        const { publicLogs } = notifications;
        const registeredLogChannel = publicLogs.publicLogChannel;

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
                value: `<t:${timestampToDate(member.user.createdTimestamp)}:R>`,
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

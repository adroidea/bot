import { Client, EmbedBuilder, Events, GuildBan, TextChannel } from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { ILogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';
import { timestampToDate } from '../../../../utils/botUtil';

export default {
    name: Events.GuildBanRemove,
    async execute(client: Client, ban: GuildBan) {
        console.log(ban);
        const {
            modules: { logs }
        } = await guildService.getOrCreateGuild(ban.guild);
        const { guildBanRemove } = logs;

        if (shouldIgnoreBanAdd(guildBanRemove)) return;

        const logChannel = client.channels.cache.get(guildBanRemove.channelId);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${ban.user.id}`,
                iconURL: ban.user.avatarURL()!
            })
            .setThumbnail(ban.user.avatarURL())
            .setTitle(`${ban.user.username}`)
            .setDescription(`Nul, il s'est fait deban`)
            .addFields({
                name: '❄ Création :',
                value: `<t:${timestampToDate(ban.user.createdTimestamp)}:R>`,
                inline: false
            })
            .addFields({
                name: '❄ Raison :',
                value: `${ban.reason}`,
                inline: false
            })
            .setFooter({
                text: "C'est re un bg du coup ?"
            })
            .setTimestamp()
            .setColor(Colors.random);
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreBanAdd = (guildBanAdd: ILogsModule['guildBanAdd']) =>
    !guildBanAdd.enabled || guildBanAdd.channelId === '';

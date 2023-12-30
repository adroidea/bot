import { Client, EmbedBuilder, Events, GuildBan, TextChannel } from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { ILogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';
import { timestampToDate } from '../../../../utils/botUtil';

export default {
    name: Events.GuildBanAdd,
    async execute(client: Client, ban: GuildBan) {
        console.log(ban);
        const {
            modules: { logs }
        } = await guildService.getOrCreateGuild(ban.guild);
        const { guildBanAdd } = logs;

        if (shouldIgnoreBanAdd(guildBanAdd)) return;

        const logChannel = client.channels.cache.get(guildBanAdd.channelId);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${ban.user.id}`,
                iconURL: ban.user.avatarURL()!
            })
            .setThumbnail(ban.user.avatarURL())
            .setTitle(`CHEH ${ban.user.username}`)
            .setDescription(`IL S'EST FAIT BAN CHEH`)
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
                text: "T'es vraiment pas bg tu sais ?"
            })
            .setTimestamp()
            .setColor(Colors.random);
        await (logChannel as TextChannel).send({ embeds: [embed] });
    }
};

const shouldIgnoreBanAdd = (guildBanAdd: ILogsModule['guildBanAdd']) =>
    !guildBanAdd.enabled || guildBanAdd.channelId === '';

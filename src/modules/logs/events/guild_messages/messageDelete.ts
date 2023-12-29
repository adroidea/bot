import { Client, EmbedBuilder, Events, Message, TextChannel } from 'discord.js';
import { Colors } from '../../../../utils/consts';
import { ILogsModule } from 'adroi.d.ea';
import guildService from '../../../../services/guildService';

export default {
    name: Events.MessageDelete,
    async execute(client: Client, message: Message) {
        if (!message.guild) return;

        const {
            modules: { logs }
        } = await guildService.getOrCreateGuild(message.guild);
        const { messageDelete } = logs;

        if (shouldIgnoreDelete(messageDelete, message)) return;

        const logChannel = client.channels.cache.get(messageDelete.channelId);

        if (message.content && logChannel) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${message.author.username} (${message.author.id})`,
                    iconURL: message.author.avatarURL()!
                })
                .setDescription(
                    `Message supprimé de ${message.author.username} dans <#${message.channelId}>, [voir le salon](${message.url})`
                )
                .addFields([
                    {
                        name: `Message supprimé :`,
                        value: '❄ ' + message.content,
                        inline: false
                    }
                ])
                .setFooter({ text: `Message supprimé.` })
                .setColor(Colors.red)
                .setTimestamp();

            await (logChannel as TextChannel).send({ embeds: [embed] });
        }
    }
};

const shouldIgnoreDelete = (messageDelete: ILogsModule['messageDelete'], message: Message) =>
    !messageDelete.enabled ||
    (messageDelete.ignoreBots && message.author.bot) ||
    messageDelete.ignoredChannels.includes(message.channelId) ||
    messageDelete.ignoredUsers.includes(message.author.id) ||
    messageDelete.channelId === '';

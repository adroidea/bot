import { Client, EmbedBuilder, Events, Message, TextChannel } from 'discord.js';
import { Colors, OWNER_ID } from '../../../../utils/consts';
import guildService from '../../../../services/guildService';
import { isNotifSMEnabled } from '../../../../utils/modulesUil';

module.exports = {
    name: Events.MessageDelete,
    async execute(client: Client, message: Message) {
        const {
            modules: { notifications }
        } = await guildService.getOrCreateGuild(message.guildId!);
        if (!isNotifSMEnabled(notifications, 'privateLogs')) return;

        const { privateLogChannel, notLoggedChannels } = notifications.privateLogs;

        if (!privateLogChannel) {
            return;
        }

        const logChannel = client.channels.cache.get(privateLogChannel);

        if (message.content && logChannel) {
            if (
                message.author.id !== OWNER_ID &&
                !message.author.bot &&
                !notLoggedChannels?.includes(message.channelId)
            ) {
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
    }
};

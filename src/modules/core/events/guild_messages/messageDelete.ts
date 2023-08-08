import { Client, EmbedBuilder, Events, Message, TextChannel } from 'discord.js';
import { Colors, OWNER_ID } from '../../../../utils/consts';
import { IGuild } from '../../../../models';
import guildService from '../../../../services/guildService';

module.exports = {
    name: Events.MessageDelete,
    async execute(client: Client, message: Message) {
        const guildSettings: IGuild = await guildService.getorCreateGuild(message.guildId!);

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

        const notLoggedChannels = moduleSettings.notLoggedChannels;

        const logChannel = client.channels.cache.get(registeredLogChannel);

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

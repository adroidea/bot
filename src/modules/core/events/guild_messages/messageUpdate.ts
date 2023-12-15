import { Client, EmbedBuilder, Events, Message, TextChannel } from 'discord.js';
import { OWNER_ID } from '../../../../utils/consts';
import guildService from '../../../../services/guildService';
import { isNotifSMEnabled } from '../../../../utils/modulesUil';

export default {
    name: Events.MessageUpdate,
    async execute(client: Client, oldMessage: Message, newMessage: Message) {
        const {
            modules: { notifications }
        } = await guildService.getOrCreateGuild(newMessage.guild!);

        if (!isNotifSMEnabled(notifications, 'privateLogs')) return;

        const { privateLogChannel, notLoggedChannels } = notifications.privateLogs;

        if (!privateLogChannel) {
            return;
        }

        const oldText = oldMessage.content || '';
        const newText = newMessage.content || '';

        const logChannel = client.channels.cache.get(privateLogChannel);

        const isMessageUpdated = oldText !== null && newText !== null && oldText !== newText;
        if (isMessageUpdated && !notLoggedChannels?.includes(newMessage.channelId) && logChannel) {
            if (!newMessage.author.bot && newMessage.author.id !== OWNER_ID) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${newMessage.author.username} (${newMessage.author.id})`,
                        iconURL: newMessage.author.avatarURL()!
                    })
                    .setDescription(
                        `Message edité dans <#${oldMessage.channelId}>, [voir le message](${oldMessage.url})`
                    )
                    .addFields([
                        {
                            name: `Ancien message :`,
                            value: oldText,
                            inline: false
                        },
                        {
                            name: `Nouveau message :`,
                            value: newText,
                            inline: false
                        }
                    ])
                    .setFooter({ text: `Message modifié.` })
                    .setColor([45, 249, 250])
                    .setTimestamp();
                await (logChannel as TextChannel).send({ embeds: [embed] });
            }
        }
    }
};

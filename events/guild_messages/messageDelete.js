const { MessageEmbed } = require('discord.js');
const { OWNER_ID } = require('../../utils/config');
module.exports = {
    name: 'messageDelete',
    once: false,
    /**
     * Event triggered when a user deletes a message in the guild. When triggered, sends a log message in the private log channel.
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} message - Represents a message on Discord.
     */
    async execute(client, message) {
        const fetchGuild = await client.getGuild(message.guild);
        const logChannel = client.channels.cache.get(
            fetchGuild.privateLogChannel
        );
        const notLoggedChannels = fetchGuild.notLoggedChannels;

        if (
            message.content !== null &&
            logChannel !== undefined &&
            logChannel !== undefined
        ) {
            if (
                message.author.id !== OWNER_ID &&
                !message.author.bot &&
                !notLoggedChannels.includes(message.channelId)
            ) {
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `${message.author.id}`,
                        iconURL: message.author.avatarURL()
                    })
                    .setDescription(
                        `Message supprimé de ${message.author.username} dans <#${message.channelId}>, [voir le salon](${message.url})`
                    )
                    .addField(
                        `Message supprimé :`,
                        '❄ ' + message.content,
                        false
                    )
                    .setFooter({ text: `Message supprimé.` })
                    .setColor('#b02020')
                    .setTimestamp();
                if (message.attachments.size > 0)
                    embed.setImage(message.attachments.first()?.url);
                await logChannel.send({ embeds: [embed] });
            }
        }
    }
};

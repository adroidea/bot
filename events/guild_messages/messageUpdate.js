const { MessageEmbed } = require('discord.js');
const { OWNER_ID } = require('../../utils/config');
module.exports = {
    name: 'messageUpdate',
    once: false,
    /**
     * Event triggered when a user updates a message in the guild. When triggered, sends a comparison message in the private log channel.
     * @param {ClientOptions} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {*} oldMessage - Represents a message on Discord.
     * @param {*} newMessage - Represents a message on Discord.
     */
    async execute(client, oldMessage, newMessage) {
        const fetchGuild = await client.getGuild(newMessage.guild);
        const logChannel = client.channels.cache.get(
            fetchGuild.privateLogChannel
        );
        const notLoggedChannels = fetchGuild.notLoggedChannels;

        if (
            oldMessage.content !== null &&
            newMessage.content !== null &&
            oldMessage.content !== newMessage.content &&
            !notLoggedChannels.includes(newMessage.channelId) &&
            logChannel !== undefined &&
            logChannel !== undefined
        ) {
            if (!newMessage.author.bot && newMessage.author.id !== OWNER_ID) {
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `<@${newMessage.author.id}>`,
                        iconURL: newMessage.author.avatarURL()
                    })
                    .setDescription(
                        `Message edité dans <#${oldMessage.channelId}>, [voir le message](${oldMessage.url})`
                    )
                    .addFields(
                        {
                            name: `Ancien message :`,
                            value: oldMessage.content,
                            inline: false
                        },
                        {
                            name: `Nouveau message :`,
                            value: newMessage.content,
                            inline: false
                        }
                    )
                    .setFooter({ text: `Message modifié.` })
                    .setColor('#b02020')
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] });
            }
        }
    }
};

const { MessageEmbed } = require('discord.js');
const { OWNER_ID } = require('../../utils/config');
module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(client, message) {
        const logChannel = client.channels.cache.get('816172869339185163');
        if (message.content !== null) {
            if (message.author.id !== OWNER_ID && !message.author.bot) {
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

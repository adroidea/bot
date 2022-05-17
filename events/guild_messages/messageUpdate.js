const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'messageUpdate',
    once: false,
    async execute(client, oldMessage, newMessage) {
        const logChannel = client.channels.cache.get('816172869339185163');

        if (oldMessage.content !== null && newMessage.content !== null && oldMessage.content !== newMessage.content) {
            if (!newMessage.author.bot || message.author.id !== OWNER_ID) {
                const embed = new MessageEmbed()
                    .setAuthor({ name: `<@${newMessage.author.id}>`, iconURL: newMessage.author.avatarURL() })
                    .setDescription(`Message edité dans <#${oldMessage.channelId}>, [voir le message](${oldMessage.url})`)
                    .addFields(
                        { name: `Ancien message :`, value: oldMessage.content, inline: false },
                        { name: `Nouveau message :`, value: newMessage.content, inline: false }
                    )
                    .setFooter({ text: `Message modifié.` })
                    .setColor('#b02020')
                    .setTimestamp();
                await logChannel.send({ embeds: [embed] }).catch(error => message.reply('une erreur c\'est produite.'));
            }
        }
    }
};

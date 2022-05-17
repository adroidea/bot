const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    async execute(client, oldMember, newMember) {
        const logChannel = client.channels.cache.get('816172869339185163');
        if (oldMember.nickname !== newMember.nickname) {
            const embed = new MessageEmbed()
                .setAuthor({ name: `${newMember.user.tag}`, iconURL: newMember.avatarURL() })
                .setDescription(`<@${newMember.id}> a changé de pseudo`)
                .addField('Avant', oldMember.nickname !== null ? oldMember.nickname : oldMember.user.username, false)
                .addField('Maintenant', newMember.nickname !== null ? newMember.nickname : newMember.user.username, false)
                .setColor('#20B068')
                .setFooter({ text: `ID: ${newMember.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] }).catch(error => message.reply('une erreur c\'est produite.'));
        }
    }
};

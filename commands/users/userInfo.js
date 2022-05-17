const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'userinfo',
    type: 'USER',
    category: 'users',
    permissions: ['SEND_MESSAGES'],
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const embed = new MessageEmbed()
            .setAuthor({ name: `${member.user.tag} (${member.user.id})`, iconURL: member.user.displayAvatarURL() })
            .setImage(member.user.displayAvatarURL())
            .addFields(
                { name: '❄ Nom', value: `${member.displayName}`, inline: true },
                { name: '❄ Moderateur', value: `${member.kickable ? '🔴' : '🟢'}`, inline: true },
                { name: '❄ Bot', value: `${member.user.bot ? '🟢' : '🔴'}`, inline: true },
                {
                    name: '❄ Roles',
                    value: `${member.roles.cache.map(role => role).join(' ').replace('@everyone', '\u200B')}`
                },
                {
                    name: '❄ Création',
                    value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`
                },
                {
                    name: '❄ Arrivée',
                    value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`
                }
            )
            .setFooter({
                text: 'Même si tu stalk les profils t\'es un turbo bg !',
                iconURL: interaction.user.displayAvatarURL()
            })
            .setColor(randomColor)
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

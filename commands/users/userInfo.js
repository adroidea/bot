const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'userinfo',
    type: 'USER',
    async runInteraction(client, interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const embed = new MessageEmbed()
            .setAuthor({name: `${member.user.tag} (${member.user.id})`, iconURL: member.user.displayAvatarURL()})
            .setImage(member.user.displayAvatarURL())
            .addFields(
                {name: '❄ Name', value: `${member.displayName}`, inline: true},
                {name: '❄ Moderator', value: `${member.kickable ? '🔴' : '🟢'}`, inline: true},
                {name: '❄ Bot', value: `${member.user.bot ? '🟢' : '🔴'}`, inline: true},
                {name: '❄ Roles', value: `${member.roles.cache.map(role => role).join(' ').replace('@everyone', '\u200B')}`},
                {name: '❄ Created', value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)`},
                {name: '❄ Joined', value: `<t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)`}
            )
            .setFooter({
                text: 'I see you stalking but you still are handsome !',
                iconURL: interaction.user.displayAvatarURL()
            })
            .setColor(randomColor)
            .setTimestamp();
        interaction.reply({embeds: [embed], ephemeral: true});
    }
};

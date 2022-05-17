const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(client, member) {
        const logChannel = client.channels.cache.get('814621178223394818');
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${member.user.id}`,
                iconURL: member.user.avatarURL()
            })
            .setThumbnail(member.user.avatarURL())
            .setTitle(
                `<a:pikaHi:960872476718551070> Bienvenue sur le serveur ${member.user.tag} !`
            )
            .setDescription(
                `Bonjour à toi ! Surtout n'oublie pas, le bon sens est une règle, veille à respecter ce qui devrait être évident !
             Nous souhaitons que ton expérience parmi nous soit aussi plaisante que possible, et nous nous y emploierons constamment.`
            )
            .addFields(
                {
                    name: '❄ Création :',
                    value: `<t:${parseInt(
                        member.user.createdTimestamp / 1000
                    )}:R>`,
                    inline: true
                },
                {
                    name: '❄ Nombre de membres :',
                    value: `${member.guild.memberCount}`,
                    inline: true
                }
            )
            .setFooter({
                text: "T'es vraiment bg tu sais ?",
                iconURL: member.user.avatarURL()
            })
            .setTimestamp()
            .setColor(randomColor);
        await logChannel.send({ embeds: [embed] });
    }
};

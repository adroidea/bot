const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'support',
    description:
        'Show a message that gives you the opportunity to support the author of this bot',
    category: 'utils',
    permissions: ['ADMINISTRATOR'],
    usage: 'support',
    examples: ['support'],
    runInteraction(client, interaction) {
        const embed = new MessageEmbed()
            .setColor('#FFFF00')
            .setAuthor({
                name: `${interaction.member.user.tag}`,
                iconURL: interaction.member.user.avatarURL()
            })
            .setTitle(
                '<:follow:816199077351784469> Si vous souhaitez me soutenir financièrement :'
            )
            .setDescription(
                "ㅤTu es déjà un turbo bg et tu suis déjà mes streams ? Merci beaucoup ! Tu veux aller plus loin dans le soutien que tu m'apportes et tu souhaites contribuer à l'amélioration de mes streams (ou m'éviter de manger des pâtes tous les jours) ? C'est ici !"
            )
            .addFields(
                { name: '\u200B', value: '\u200B', inline: false },
                {
                    name: '<a:pop:935826625726136390> Me soutenir avec des avantages',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: 'ㅤUn sub prime ou T1/T2/T3',
                    value: "ㅤㅤParce qu'un beau badge c'est jamais suffisant, débloque toutes les commandes vocales pour les sub ET un bonus de point de chaîne pour obtenir le VIP encore plus vite",
                    inline: false
                },
                { name: '\u200B', value: '\u200B', inline: false },
                {
                    name: '<a:catJAM:948587264554975272> Me soutenir ++',
                    value: '\u200B',
                    inline: false
                },
                {
                    name: 'ㅤPaypal',
                    value: 'ㅤㅤhttps://paypal.me/AdanneEA',
                    inline: false
                },
                {
                    name: 'ㅤDon en stream',
                    value: 'ㅤㅤhttps://streamelements.com/adan_ea/tip',
                    inline: false
                },
                { name: '\u200B', value: '\u200B', inline: false },
                {
                    name: "<a:catKiss:948600375856996373> Me soutenir quand on n'a pas les moyens, et qu'on est quand même un turbo bg !",
                    value: '\u200B',
                    inline: false
                },
                {
                    name: 'ㅤInstant Gaming',
                    value: 'ㅤㅤhttps://www.instant-gaming.com/?igr=adan-ea',
                    inline: false
                },
                {
                    name: 'ㅤNavigateur Brave !',
                    value: "ㅤㅤUn doc explicatif viendra sous peu ! Mais en gros c'est un navigateur qui vous paye pour avoir des pubs de temps en temps, et vous pouvez partager un peu de votre fortune",
                    inline: false
                }
            )
            .setFooter({
                text: `NB : Pour les sub et les cheers de bits, pensez à bien passer sur pc pour les acheter`,
                iconURL: interaction.member.user.avatarURL()
            });
        interaction.reply({ embeds: [embed] });
    }
};

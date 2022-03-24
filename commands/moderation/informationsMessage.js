const {MessageEmbed} = require('discord.js');
const {type} = require('../users/userInfo');

module.exports = {
    name: 'feaz',
    description: 'get the ping of the bot',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    usage: 'ping',
    exemples: ['ping'],
    async runInteraction(client, interaction) {
        let role = await interaction.member.roles.cache.get('956467697439350794');
        if(role === undefined){
            interaction.member.roles.add('956467697439350794');
            interaction.reply({content: `role <@956467697439350794> successfuly added.`, ephemeral: true});
        } else {
            interaction.member.roles.remove('956467697439350794');
            interaction.reply({content: `role <@956467697439350794> successfuly added.`, ephemeral: true});
        }
    }
};

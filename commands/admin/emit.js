module.exports = {
    name: 'emit',
    description: 'Emmit a new event if an admin needs to try a command or something',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'emit [event]',
    exemples: ['emit guildMemberAdd'],
    options: [{
        name: 'event',
        description: 'Choose the event to emmit',
        type: 'STRING',
        required: true,
        choices: [{
            name: 'guildMemberAdd',
            value: 'guildMemberAdd'
        },
            {
                name: 'guildMemberRemove',
                value: 'guildMemberRemove'
            },
            {
                name: 'guildCreate',
                value: 'guildCreate'
            }]
    }],
    runInteraction(client, interaction) {
        const evtChoices = interaction.options.getString('event');
        if (evtChoices === 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({content: 'Event guildMemberAdd emmited', ephemeral: true});
        } else if (evtChoices === 'guildMemberRemove') {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({content: 'Event guildMemberRemove emmited', ephemeral: true});
        } else if (evtChoices === 'guildCreate') {
            client.emit('guildCreate', interaction.guild);
            interaction.reply({content: 'Event guildCreate emmited', ephemeral: true});
        }
    }
};

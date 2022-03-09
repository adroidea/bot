module.exports = {
    name: 'emit',
    description: 'Emmit a new event if an admin needs to try a command or something',
    run(client, message, args) {
        if (!args[0] || !args[0].match(/^(guildMemberAdd|guildMemberRemove)$/)) {
            return message.reply('Please enter a correct event.');
        }
        if (args[0] === 'guildMemberAdd') {
            client.emit('guildMemberAdd', message.member);
            message.react('👍');

        } else if (args[0] === 'guildMemberRemove') {
            client.emit('guildMemberRemove', message.member);
            message.react('👍');
        } else if (args[0] === 'guildCreate') {
            client.emit('guildCreate', message.guild);
            message.react('👍');
        }
    },
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

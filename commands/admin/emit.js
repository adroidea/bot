module.exports = {
    name: 'emit',
    description:
        '[ADMIN] Emmet un nouvel évènement si un admin souhaite essayer une nouvelle commande',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'emit [event]',
    examples: ['emit guildMemberAdd'],
    options: [
        {
            name: 'event',
            description: 'Choix event à émettre',
            type: 'STRING',
            required: true,
            choices: [
                {
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
                }
            ]
        }
    ],
    runInteraction(client, interaction) {
        const evtChoices = interaction.options.getString('event');
        if (evtChoices === 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({
                content: 'Evenement guildMemberAdd émit !',
                ephemeral: true
            });
        } else if (evtChoices === 'guildMemberRemove') {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({
                content: 'Evenement guildMemberRemove émit',
                ephemeral: true
            });
        } else if (evtChoices === 'guildCreate') {
            client.emit('guildCreate', interaction.guild);
            interaction.reply({
                content: 'Evenement guildCreate émit',
                ephemeral: true
            });
        }
    }
};

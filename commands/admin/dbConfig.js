module.exports = {
    name: 'dbconfig',
    description: 'Configurer les données de la Base de données',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'dbconfig [key] <value>',
    examples: ['dbconfig publicLogChannel 814621178223394818'],
    options: [
        {
            name: 'key',
            description: 'Choisir une clé à modifier ou afficher',
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: 'publicLogChannel',
                    value: 'publicLogChannel'
                },
                {
                    name: 'privateLogChannel',
                    value: 'privateLogChannel'
                },
                {
                    name: 'protectedChannels',
                    value: 'protectedChannels'
                },
                {
                    name: 'hostedChannels',
                    value: 'hostedChannels'
                }
            ]
        },
        {
            name: 'value',
            description: 'Choisir une valeur à affecter',
            type: 'STRING'
        }
    ],
    async runInteraction(client, interaction, guildSettings) {
        const key = interaction.options.getString('key');
        const value = interaction.options.getString('value');

        if (key === 'publicLogChannel') {
            if (value) {
                await client.updateGuild(interaction.guild, {
                    publicLogChannel: value
                });
                return interaction.reply({
                    content: `Le channel de logs publics est maintenant ${value}`,
                    ephemeral: true
                });
            }
            interaction.reply({
                content: `Le channel ${guildSettings.publicLogChannel} est le channel de logs publics (Arrivées et départs)`,
                ephemeral: true
            });
        } else if (key === 'privateLogChannel') {
            if (value) {
                await client.updateGuild(interaction.guild, {
                    privateLogChannel: value
                });
                return interaction.reply({
                    content: `Le channel de logs privé est maintenant ${value}`,
                    ephemeral: true
                });
            }
            interaction.reply({
                content: `Le channel ${guildSettings.privateLogChannel} est le channel de logs publics (Kick, Ban, edit et suppressions de messages, changement de pseudo, etc.)`,
                ephemeral: true
            });
        } else if (key === 'protectedChannels') {
            if (value) {
                await client.updateGuild(interaction.guild, {
                    protectedChannels: value
                });
                return interaction.reply({
                    content: `Le channel de logs publics est maintenant ${value}`,
                    ephemeral: true
                });
            }
            interaction.reply({
                content: `Le channel ${guildSettings.protectedChannels} est le channel de logs publics (Kick, Ban, edit et suppressions de messages, changement de pseudo, etc.)`,
                ephemeral: true
            });
        } else if (key === 'hostedChannels') {
            if (value) {
                await client.updateGuild(interaction.guild, {
                    hostedChannels: value
                });
                return interaction.reply({
                    content: `Le channel de logs publics est maintenant ${value}`,
                    ephemeral: true
                });
            }
            interaction.reply({
                content: `Le channel ${guildSettings.hostedChannels} est le channel de logs publics (Kick, Ban, edit et suppressions de messages, changement de pseudo, etc.)`,
                ephemeral: true
            });
        }
    }
};

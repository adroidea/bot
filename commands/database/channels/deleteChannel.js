module.exports = {
    name: 'delchan',
    description: '[ADMIN] Configurer les différents salons',
    category: 'database',
    permissions: ['ADMINISTRATOR'],
    usage: 'delchan [channel] [id]',
    examples: ['delchan publicLog 814621178223394818'],
    options: [
        {
            name: 'public-log',
            description: 'Retire id du salon des logs public',
            type: 'STRING',
            required: false
        },
        {
            name: 'private-log',
            description: 'Retire id du salon des logs privé',
            type: 'STRING',
            required: false
        },
        {
            name: 'protected-voice',
            description:
                "Retire la protection d'un salon vocal de la suppression",
            type: 'STRING',
            required: false
        },
        {
            name: 'host-voice',
            description: 'Retire un salon vocal hôte',
            type: 'STRING',
            required: false
        },
        {
            name: 'not-logged-channel',
            description: 'Ajoute un channel à logger',
            type: 'STRING',
            required: false
        }
    ],
    /**
     * Command to remove default channels for the server in the database
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {CommandInteraction} interaction - Represents a command interaction.
     */
    async runInteraction(client, interaction) {
        const publicLog = interaction.options.getString('public-log');
        const privateLog = interaction.options.getString('private-log');
        const protectedVoice = interaction.options.getString('protected-voice');
        const hostVoice = interaction.options.getString('host-voice');
        const notLoggedChan =
            interaction.options.getString('not-logged-channel');
        // Remove a public log channel id to the database, for arrival and leaving notifications
        if (publicLog !== null) {
            if (client.channels.cache.get(publicLog)?.isText()) {
                await client.updateGuild(interaction.guild, {
                    publicLogChannel: null
                });
                interaction.reply({
                    content: `Le channel de logs public est désactivé`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Le channel <#${publicLog}> (${publicLog}) n'est pas un salon textuel ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }
        // Remove a private log channel id to the database, for every event. (nickname edit, message edit and delete).
        if (privateLog !== null) {
            if (client.channels.cache.get(privateLog)?.isText()) {
                await client.updateGuild(interaction.guild, {
                    privateLogChannel: null
                });
                interaction.reply({
                    content: `Le channel de logs privé a été désactivé`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Le channel <#${privateLog}> (${privateLog}) n'est pas un salon textuel ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }
        //Remove a voice channel id to the database that should not be deleted when no one is in it.
        if (protectedVoice !== null) {
            if (client.channels.cache.get(protectedVoice)?.isVoice()) {
                await client.updateGuild(interaction.guild, {
                    $pull: { protectedChannels: protectedVoice }
                });
                return interaction.reply({
                    content: `Le channel <#${protectedVoice}> n'est maintenant plus protégé contre la suppression automatique.`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `Le channel <#${protectedVoice}> n'est pas un salon vocal ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }
        //Remove a voice channel id to the database used to create temporary voice channels
        if (hostVoice !== null) {
            if (client.channels.cache.get(hostVoice)?.isVoice()) {
                await client.updateGuild(interaction.guild, {
                    $pull: { hostChannels: hostVoice }
                });
                return interaction.reply({
                    content: `Le channel <#${hostVoice}> n'est maintenant plus un salon host.`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `Le channel <#${hostVoice}> n'est pas un salon vocal ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }
        //Remove a textual channel id to the database so it will be monitored for the logs
        if (notLoggedChan !== null) {
            if (client.channels.cache.get(notLoggedChan)?.isText()) {
                await client.updateGuild(interaction.guild, {
                    $pull: { notLoggedChannels: notLoggedChan }
                });
                return interaction.reply({
                    content: `Le channel <#${notLoggedChan}> est dorénavent loggé.`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `Le channel <#${notLoggedChan}> n'est pas un salon textuel ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }
    }
};

const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = {
    name: 'addchan',
    description: '[ADMIN] Configurer les différents salons',
    category: 'database',
    permissions: ['ADMINISTRATOR'],
    usage: 'addchan [channel] [id]',
    examples: ['addchan publiceLog 814621178223394818'],
    options: [
        {
            name: 'public-log',
            description: 'change id du salon des logs public',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'private-log',
            description: 'change id du salon des logs privé',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'protected-voice',
            description: 'Ajoute un salon vocal protégé contre la suppression',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'host-voice',
            description: 'Ajoute un salon vocal hôte',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'not-logged-channel',
            description: 'Ajoute un channel non loggé',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    /**
     * Command to add default channels for the server in the database
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
        // Adds a public log channel id to the database, for arrival and leaving notifications
        if (publicLog !== null) {
            if (client.channels.cache.get(publicLog)?.type === ChannelType.GuildText) {
                await client.updateGuild(interaction.guild, {
                    publicLogChannel: publicLog
                });
                interaction.reply({
                    content: `Le channel de logs public est maintenant <#${publicLog}> ${publicLog}`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Le channel <#${publicLog}> (${publicLog}) n'est pas un salon textuel ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }

        // Adds a private log channel id to the database, for every event. (nickname edit, message edit and delete).
        if (privateLog !== null) {
            if (client.channels.cache.get(privateLog)?.type === ChannelType.GuildText) {
                await client.updateGuild(interaction.guild, {
                    privateLogChannel: privateLog
                });
                interaction.reply({
                    content: `Le channel de logs privé est maintenant <#${privateLog}> ${privateLog}`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Le channel <#${privateLog}> (${privateLog}) n'est pas un salon textuel ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }

        //Adds a voice channel id to the database that should be deleted when no one is in it.
        if (protectedVoice !== null) {
            if (client.channels.cache.get(protectedVoice)?.type === ChannelType.GuildVoice) {
                await client.updateGuild(interaction.guild, {
                    $addToSet: { protectedChannels: protectedVoice }
                });
                return interaction.reply({
                    content: `Le channel <#${protectedVoice}> est maintenant protégé contre la suppression automatique.`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `Le channel <#${protectedVoice}> n'est pas un salon vocal ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }

        //Adds a voice channel id to the database used to create temporary voice channels
        if (hostVoice !== null) {
            if (client.channels.cache.get(hostVoice)?.type === ChannelType.GuildVoice) {
                await client.updateGuild(interaction.guild, {
                    $addToSet: { hostChannels: hostVoice }
                });
                return interaction.reply({
                    content: `Le channel <#${hostVoice}> est maintenant un salon host.`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `Le channel <#${hostVoice}> n'est pas un salon vocal ou n'est pas accessible par ce bot`,
                    ephemeral: true
                });
            }
        }

        //Adds a textual channel id to the database that will not be monitored for the logs
        if (notLoggedChan !== null) {
            if (client.channels.cache.get(notLoggedChan)?.type === ChannelType.GuildText) {
                await client.updateGuild(interaction.guild, {
                    $addToSet: { notLoggedChannels: notLoggedChan }
                });
                return interaction.reply({
                    content: `Le channel <#${notLoggedChan}> a été ajouté à la liste des salons non surveillé.`,
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

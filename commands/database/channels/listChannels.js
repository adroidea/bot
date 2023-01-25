const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'listchan',
    description: '[ADMIN] Configurer les différents salons',
    category: 'database',
    permissions: ['ADMINISTRATOR'],
    usage: 'listchan [channel] [id]',
    examples: ['listchan publicLog'],
    options: [
        {
            name: 'channel-list',
            description: 'Liste des channels',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'all',
                    value: 'all'
                },
                {
                    name: 'public-log',
                    value: 'public-log'
                },
                {
                    name: 'private-log',
                    value: 'private-log'
                },
                {
                    name: 'protected-voice',
                    value: 'protected-voice'
                },
                {
                    name: 'host-voice',
                    value: 'host-voice'
                },
                {
                    name: 'not-logged-channel',
                    value: 'not-logged-channel'
                }
            ]
        }
    ],
    /**
     * List all the default channels for the server in the database
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {CommandInteraction} interaction - Represents a command interaction.
     * @param {*} guildSettings - Represents the guild in which the action is made.
     */
    async runInteraction(client, interaction, guildSettings) {
        const channelList = interaction.options.getString('channel-list');

        if (channelList === 'all') {
            const embed = new EmbedBuilder()
                .setTitle('Listes des salons en base de données')
                .addFields([
                    {
                        name: '**Log publiques**',
                        value: `<#${guildSettings.publicLogChannel}> ${guildSettings.publicLogChannel}`,
                        inline: true
                    },
                    {
                        name: '**Logs privées**',
                        value: `<#${guildSettings.privateLogChannel}> ${guildSettings.privateLogChannel}`,
                        inline: true
                    },
                    {
                        name: '**Salons ignorés**',
                        value: getChannels(guildSettings.notLoggedChannels),
                        inline: false
                    }
                ])
                .addFields([
                    {
                        name: '**Salons protégés**',
                        value: getChannels(guildSettings.protectedChannels),
                        inline: false
                    },
                    {
                        name: '**Salons host ** *(non supprimables par le bot)*',
                        value: getChannels(guildSettings.hostChannels),
                        inline: false
                    }
                ]);
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (channelList === 'public-log') {
            if (
                guildSettings.publicLogChannel !== undefined &&
                guildSettings.publicLogChannel !== null
            ) {
                interaction.reply({
                    content: `Le channel <#${guildSettings.publicLogChannel}> (${guildSettings.publicLogChannel}) est le channel de logs publics (Départs et arrivés)`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Aucun channel de logs public n'est configuré`,
                    ephemeral: true
                });
            }
        }

        if (channelList === 'private-log') {
            if (
                guildSettings.privateLogChannel !== undefined &&
                guildSettings.privateLogChannel !== null
            ) {
                interaction.reply({
                    content: `Le channel <#${guildSettings.privateLogChannel}> (#${guildSettings.privateLogChannel})est le channel de logs privé (Kick, Ban, edit et suppressions de messages, changement de pseudo, etc.)`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `Aucun channel de logs privé n'est configuré`,
                    ephemeral: true
                });
            }
        }

        if (channelList === 'protected-voice') {
            interaction.reply({
                content: `Les channels protégés contre la suppression automatique sont :\n${getChannels(
                    guildSettings.protectedChannels
                )}`,
                ephemeral: true
            });
        }

        if (channelList === 'host-voice') {
            interaction.reply({
                content: `Les channels host sont :\n${getChannels(
                    guildSettings.hostChannels
                )}`,
                ephemeral: true
            });
        }

        if (channelList === 'not-logged-channel') {
            interaction.reply({
                content: `Les channels qui ne sont pas loggés sont :\n${getChannels(
                    guildSettings.notLoggedChannels
                )}`,
                ephemeral: true
            });
        }
    }
};

let getChannels = channelsToGet => {
    let channelList = '';
    channelsToGet.forEach(
        channel => (channelList += `<#${channel}> ${channel}\n`)
    );
    if (channelList === '') return (channelList = 'Aucun salon affecté');
    return channelList;
};

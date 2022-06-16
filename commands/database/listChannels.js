module.exports = {
    name: 'listchan',
    description: '[ADMIN] Configurer les différents salons',
    category: 'database',
    permissions: ['ADMINISTRATOR'],
    usage: 'listchan [channel] [id]',
    examples: ['listchan privateLog 814621178223394818'],
    options: [
        {
            name: 'channel-list',
            description: 'Liste des channels',
            type: 'STRING',
            required: true,
            choices: [
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
    async runInteraction(client, interaction, guildSettings) {
        const channelList = interaction.options.getString('channel-list');

        if (channelList === 'public-log') {
            if (guildSettings.publicLogChannel !== undefined && guildSettings.publicLogChannel !== null) {
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
            if (guildSettings.privateLogChannel !== undefined && guildSettings.privateLogChannel !== null) {
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
            let protectedChannelList = '';
            guildSettings.protectedChannels.forEach(
                protectedChannel =>
                    (protectedChannelList += `<#${protectedChannel}> (${protectedChannel})\n`)
            );
            guildSettings.hostChannels.forEach(
                channel =>
                    (protectedChannelList += `<#${channel}> (${channel}) (via host)\n`)
            );
            interaction.reply({
                content: `Les channels protégés contre la suppression automatique sont :\n${protectedChannelList}`,
                ephemeral: true
            });
        }

        if (channelList === 'host-voice') {
            let hostChannelList = '';
            guildSettings.hostChannels.forEach(
                hostChannel =>
                    (hostChannelList += `<#${hostChannel}> (${hostChannel})\n`)
            );
            interaction.reply({
                content: `Les channels host sont :\n${hostChannelList}`,
                ephemeral: true
            });
        }

        if (channelList === 'not-logged-channel') {
            let channelList = '';
            guildSettings.notLoggedChannels.forEach(
                channel => (channelList += `<#${channel}> (${channel})\n`)
            );
            interaction.reply({
                content: `Les channels qui ne sont pas loggés sont :\n${channelList}`,
                ephemeral: true
            });
        }
    }
};

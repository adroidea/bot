import { Client, CommandInteraction, PermissionsBitField } from 'discord.js';

module.exports = {
    data: {
        name: 'invite',
        description: 'Envoie un lien pour inviter le bot sur ton serveur'
    },
    category: 'utils',
    cooldown: 10,
    permissions: [PermissionsBitField.Flags.SendMessages],
    usage: 'invite',
    examples: ['invite'],

    execute(client: Client, interaction: CommandInteraction) {
        const client_id = process.env.DISCORD_CLIENT_ID;
        const permissions = 2199022698327;
        const url = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=${permissions}&scope=bot%20applications.commands`;
        return interaction.reply({ content: url, ephemeral: true });
    }
};

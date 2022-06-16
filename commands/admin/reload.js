module.exports = {
    name: 'reload',
    description: '[ADMIN] Relancer le bot',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'reload',
    examples: ['reload'],
    async runInteraction(client, interaction) {
        await interaction.reply({content: 'Relancement du bot en cours, je reviens !', ephemeral: true});
        return process.exit();
    }
};

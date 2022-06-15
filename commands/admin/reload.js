module.exports = {
    name: 'reload',
    category: 'admin',
    permissions: ['ADMINISTRATOR'],
    usage: 'reload',
    examples: ['reload'],
    description: 'Relancer le bot',
    async runInteraction(client, interaction) {
        await interaction.reply({content: 'Relancement du bot en cours, je reviens !', ephemeral: true});
        return process.exit();
    }
};

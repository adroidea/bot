module.exports = {
    name: 'purge',
    description:
        "Suppression de masse d'un certain nombre de messages dans un salon ou d'un utilisateur",
    category: 'moderation',
    permissions: ['MANAGE_MESSAGES'],
    usage: 'purge [montant] <@cible>',
    examples: ['purge 10', 'purge 100 @adan_ea'],
    options: [
        {
            name: 'montant',
            description: 'Nombre de messages à supprimer',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'cible',
            description: 'La victime de cette suppression de masse',
            type: 'USER',
            required: false
        }
    ],
    async runInteraction(client, interaction) {
        const amountToDelete = interaction.options.getNumber('montant');
        if (amountToDelete > 100 || amountToDelete < 0)
            return interaction.reply(
                'Merci de choisir un nombre entre 1 et 100'
            );
        const target = interaction.options.getMember('cible');

        const messageToDelete = await interaction.channel.messages.fetch();

        if (target) {
            let i = 0;
            const filteredTargetMessages = [];
            (await messageToDelete).filter(msg => {
                if (msg.author.id === target.id && amountToDelete > i) {
                    filteredTargetMessages.push(msg);
                    i++;
                }
            });
            await interaction.channel
                .bulkDelete(filteredTargetMessages, true)
                .then(messages => {
                    interaction.reply({
                        content: `${messages.size} messages supprimé de ${target.username}!`,
                        ephemeral: true
                    });
                });
        } else {
            await interaction.channel
                .bulkDelete(amountToDelete, true)
                .then(messages => {
                    interaction.reply({
                        content: `${messages.size} messages supprimés !`,
                        ephemeral: true
                    });
                });
        }
    }
};

module.exports = {
    name: 'purge',
    description: 'Bulk Delete a specified amount of messages in a channel or from a user',
    category: 'moderation',
    permissions: ['MANAGE_MESSAGES'],
    usage: 'purge [amount] <@target>',
    exemples: ['purge 10', 'purge 100 @adan_ea'],
    options: [{
        name: 'amount',
        description: 'Choose the number of messages to delete',
        type: 'NUMBER',
        required: true
    },
        {
            name: 'target',
            description: 'The name of the person to bulk delete',
            type: 'USER',
            required: false
        }],
    async runInteraction(client, interaction) {
        const amountToDelete = interaction.options.getNumber('amount');
        if (amountToDelete > 100 || amountToDelete < 0) return interaction.reply('Please choose a number between 1 and 100');
        const target = interaction.options.getMember('target');

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
            await interaction.channel.bulkDelete(filteredTargetMessages, true).then(messages => {
                interaction.reply({content: `${messages.size} messages deleted from ${target.username}!`, ephemeral: true});
            });
        } else {
            await interaction.channel.bulkDelete(amountToDelete, true).then(messages => {
                interaction.reply({content: `${messages.size} messages deleted !`, ephemeral: true});
            });
        }
    }
};

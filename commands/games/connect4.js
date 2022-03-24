module.exports = {
    name: 'c4',
    description: 'Start a Connect 4 with a real opponent',
    category: 'games',
    permissions:['SEND_MESSAGES'],
    usage: '',
    exemples: [],
    gameHandle(typeMessage, choice) {

    },

    async run(client, message, args) {

    },
    options: [{
        name: 'opponent',
        description: 'Choose who to play against',
        type: 'USER',
        required: true
    }],
    runInteraction(client, interaction) {
        const choice = interaction.options.getMember('opponent');
        this.gameHandle(interaction, choice);
    }
};

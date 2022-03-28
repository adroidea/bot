const TicTacToe = require('discord-tictactoe');


module.exports = {
    name: 'ttt',
    description: 'Start a tic tac toe game against an AI',
    category: 'games',
    permissions:['SEND_MESSAGES'],
    usage: 'ttt <user>',
    exemples: ['ttt','ttt @adan_ea'],
    run(client, message) {
        const game = new TicTacToe({language: 'fr'});
        game.handleMessage(message);

    },
    options: [
        {
            name: 'opponent',
            type: 'USER',
            description: 'Mention the opponent to play against',
            required: false
        }
    ],
    runInteraction(client, interaction) {
        const target = interaction.options.getMember('member');
        const game = new TicTacToe({language: 'fr', commandOptionName: 'user'});
        game.handleInteraction(interaction);
    }
};

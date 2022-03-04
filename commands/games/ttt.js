const TicTacToe = require('discord-tictactoe');


module.exports = {
    name: 'ttt',
    description: 'get the ping of the bot',
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
    runSlash(client, interaction) {
        const game = new TicTacToe({language: 'fr', commandOptionName: 'user'});
        game.handleInteraction(interaction);
    }
};

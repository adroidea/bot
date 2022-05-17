const TicTacToe = require('discord-tictactoe');

module.exports = {
    name: 'ttt',
    description: 'Commence une partie de TicTacToe contre le bot ou un joueur ',
    category: 'jeux',
    permissions: ['SEND_MESSAGES'],
    usage: 'ttt <user>',
    exemples: ['ttt', 'ttt @adan_ea'],
    options: [
        {
            name: 'adversaire',
            type: 'USER',
            description: 'Choisir votre adversaire',
            required: false
        }
    ],
    runInteraction(client, interaction) {
        const game = new TicTacToe({ language: 'fr' });
        game.handleInteraction(interaction);
    }
};

const TicTacToe = require('discord-tictactoe');


module.exports = {
    name: 'pfc',
    description: 'Start a Rock Paper Scissors game',
    category: 'games',
    usage: 'pfc [choice]',
    exemples: ['pfc p', 'pfc c', 'pfc f'],
    isPlayerOneWinner(playerOneChoice, playerTwoChoice) {
        return (playerOneChoice === 'p' && playerTwoChoice === 'c') || (playerOneChoice === 'f' && playerTwoChoice === 'p') || (playerOneChoice === 'c' && playerTwoChoice === 'f');
    },
    gameHandle(typeMessage, choice) {
        let botChoice = Math.floor(Math.random() * 3);
        let possibleChoices = ['p', 'f', 'c'];
        let emoteChoice = ['🗿', '🍁', '✂'];
        if (!choice) {
            typeMessage.reply('Tu dois choisir entre 🗿 (p), 🍁 (f) ou ✂ (c) !');
        } else if (choice === possibleChoices[botChoice]) {
            typeMessage.reply(` J'ai joué ${emoteChoice[botChoice]} ! C'est une égalité ! On réessaie ?`);
        } else if (!this.isPlayerOneWinner(choice, possibleChoices[botChoice])) {
            typeMessage.reply(`Ah dommage pour toi ! J'ai joué ${emoteChoice[botChoice]} !On réessaie ?`);
        } else if (this.isPlayerOneWinner(choice, possibleChoices[botChoice])) {
            typeMessage.reply(`J'ai joué ${emoteChoice[botChoice]} !Bravo à toi ! On réessaie ?`);
        } else {
            typeMessage.reply('Tu dois choisir entre 🗿 (p), 🍁 (f) ou ✂ (c) !');
        }
    },

    async run(client, message, args) {
        let choice = args[0];
        await this.gameHandle(message, choice);
    },
    options: [{
        name: 'choice',
        description: 'Choose the element to play',
        type: 'STRING',
        required: true,
        choices: [{
            name: 'pierre',
            value: 'p'
        }, {
            name: 'ciseaux',
            value: 'c'
        }, {
            name: 'feuille',
            value: 'f'
        }]
    }],
    runInteraction(client, interaction) {
        const choice = interaction.options.getString('choice');
        this.gameHandle(interaction, choice);
    }
};

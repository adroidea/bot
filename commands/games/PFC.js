module.exports = {
    name: 'pfc',
    description: 'Commence une partie de Pierre Feuille Ciseau.',
    category: 'jeux',
    permissions: ['SEND_MESSAGES'],
    usage: 'pfc [choice]',
    exemples: ['pfc p', 'pfc f', 'pfc c'],
    isPlayerOneWinner(playerOneChoice, playerTwoChoice) {
        return (playerOneChoice === 'p' && playerTwoChoice === 'c') || (playerOneChoice === 'f' && playerTwoChoice === 'p') || (playerOneChoice === 'c' && playerTwoChoice === 'f');
    },
    gameHandle(typeMessage, choice) {
        let botChoice = Math.floor(Math.random() * 3);
        let possibleChoices = ['p', 'f', 'c'];
        let emoteChoice = ['🗿', '🍁', '✂'];
        if (choice === possibleChoices[botChoice]) {
            typeMessage.reply({
                content: ` J'ai joué ${emoteChoice[botChoice]} ! C'est une égalité ! On réessaie ?`, ephemeral: true
            });
        } else if (!this.isPlayerOneWinner(choice, possibleChoices[botChoice])) {
            typeMessage.reply({
                content: `Ah dommage pour toi ! J'ai joué ${emoteChoice[botChoice]} ! On réessaie ?`, ephemeral: true
            });
        } else if (this.isPlayerOneWinner(choice, possibleChoices[botChoice])) {
            typeMessage.reply({
                content: `J'ai joué ${emoteChoice[botChoice]} ! Bravo à toi ! On réessaie ?`, ephemeral: true
            });
        } else {
            typeMessage.reply({content: 'Tu dois choisir entre 🗿 (p), 🍁 (f) ou ✂ (c) !', ephemeral: true});
        }
    },
    options: [{
        name: 'choix',
        description: 'Choisis l\'élément à jouer',
        type: 'STRING',
        required: true,
        choices: [{
            name: 'pierre',
            value: 'p'
        }, {
            name: 'feuille',
            value: 'f'
        }, {
            name: 'ciseaux',
            value: 'c'
        }]
    }],
    runInteraction(client, interaction) {
        const choice = interaction.options.getString('choix');
        this.gameHandle(interaction, choice);
    }
};

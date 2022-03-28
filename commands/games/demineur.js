const Minesweeper = require('discord.js-minesweeper');
module.exports = {
    name: 'demineur',
    description: 'Start a minesweeper game',
    category: 'games',
    permissions: ['SEND_MESSAGES'],
    usage: 'demineur [row] [col] [mines]',
    exemples: ['demineur 10 10 25'],
    gameHandle(typeMessage, rows, columns, mines) {
        const minesweeper = new Minesweeper({
            rows: rows,
            columns: columns,
            mines: mines,
            emote: 'boom',
            revealFirstCell: true,
            zeroFirstCell: true
        });
        const matrix = minesweeper.start();
        if (!matrix || matrix.length > 2000) {
            return typeMessage.reply({
                content: ':warning: Please change the number of rows, columns or mines.',
                ephemeral: true
            });
        }
        return matrix
            ? typeMessage.reply(matrix)
            : typeMessage.reply({content: ':warning: You have provided invalid data.', ephemeral: true});
    },

    options: [{
        name: 'rows',
        description: 'Choose the number of rows',
        type: 'NUMBER',
        required: true
    }, {
        name: 'columns',
        description: 'Choose the number of columns',
        type: 'NUMBER',
        required: true
    }, {
        name: 'mines',
        description: 'Choose the number of mines',
        type: 'NUMBER',
        required: true
    }],
    runInteraction(client, interaction) {
        const rows = interaction.options.getNumber('rows');
        const columns = interaction.options.getNumber('columns');
        const mines = interaction.options.getNumber('mines');
        this.gameHandle(interaction, rows, columns, mines);
    }
};

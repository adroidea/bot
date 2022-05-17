const Minesweeper = require('discord.js-minesweeper');
module.exports = {
    name: 'demineur',
    description: 'Démarre une partie de Démineur',
    category: 'jeux',
    permissions: ['SEND_MESSAGES'],
    usage: 'demineur [lignes] [col] [mines]',
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
                content:
                    ':warning: Merci de mettre un nombre valide de lignes, colonnes ou mines.',
                ephemeral: true
            });
        }
        return matrix
            ? typeMessage.reply(matrix)
            : typeMessage.reply({
                  content: ':warning: Données invalides, veuillez rééssayer.',
                  ephemeral: true
              });
    },

    options: [
        {
            name: 'rows',
            description: 'Nombre de lignes',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'columns',
            description: 'Nombre de colonnes',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'mines',
            description: 'Nombre de mines',
            type: 'NUMBER',
            required: true
        }
    ],
    runInteraction(client, interaction) {
        const rows = interaction.options.getNumber('rows');
        const columns = interaction.options.getNumber('columns');
        const mines = interaction.options.getNumber('mines');
        this.gameHandle(interaction, rows, columns, mines);
    }
};

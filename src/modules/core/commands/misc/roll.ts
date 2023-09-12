import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    PermissionsBitField,
    codeBlock
} from 'discord.js';
import ansis from 'ansis';

interface Dice {
    nbDices: number;
    nbFaces: number;
    operator: Operator;
    operand: number;
}

interface RollResult {
    dice: Dice;
    diceResult: number[];
    globalResult: number;
}

type Operator = '+' | '-' | '/' | '*';

module.exports = {
    data: {
        name: 'roll',
        description: 'Lance des dés',
        options: [
            {
                name: 'dé',
                description: '2d6+2, 1d300',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    category: 'misc',
    permissions: [PermissionsBitField.Flags.SendMessages],
    guildOnly: false,
    usage: '[Dés]d[Faces]<opérateur><modificateur>',
    examples: ['2d6+2', '1d300', '1d300/2', 'd6*2'],
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const diceString = interaction.options.getString('dé', true);
        const diceArr = diceString.split(' ');
        const resultArr: string[] = [];
        let total: number = 0;
        let newDice: Dice;

        diceArr.forEach((dice: string) => {
            newDice = separateDice(dice);

            const configuration: RollResult = rollDice(newDice);

            if (!isNaN(configuration.globalResult)) {
                total += configuration.globalResult;
            }

            const resultStr = formatResult(configuration).replace(/.*nan.*/i, 'Dé invalide');
            resultArr.push(resultStr);
        });

        const styledText = `Total: ${total}`;

        let resultStr = ansis.red.bold(styledText) + '\n';
        resultStr += resultArr.join('\n');

        interaction.reply({ content: codeBlock('ansi', resultStr) });
    }
};

function separateDice(configuration: string): Dice {
    const [diceConfig, operatorStr, operandStr] = configuration.split(/([+-/*])/);
    const [nbDicesString, nbFacesString] = diceConfig.split('d');
    const nbDices = parseInt(nbDicesString);
    const nbFaces = parseInt(nbFacesString);

    let operator: Operator = '+';
    let operand: number = 0;

    if (operatorStr && operandStr) {
        operator = operatorStr[0] as Operator;
        operand = parseInt(operandStr);
    }

    return {
        nbDices,
        nbFaces,
        operator,
        operand
    };
}

function rollDice(dice: Dice): RollResult {
    const { nbDices, nbFaces } = dice;

    let globalResult = 0;
    let diceResult: number[] = [];

    for (let i = 0; i < nbDices; i++) {
        const roll = Math.floor(Math.random() * nbFaces) + 1;
        globalResult += roll;
        diceResult.push(roll);
    }

    if (dice.operand !== 0) {
        switch (dice.operator) {
            case '+' as Operator:
                globalResult += dice.operand;
                break;

            case '-' as Operator:
                globalResult -= dice.operand;
                break;

            case '/' as Operator:
                globalResult /= dice.operand;
                break;

            case '*' as Operator:
                globalResult *= dice.operand;
                break;

            default:
                console.log('Invalid operator', dice.operator);
                break;
        }
    }

    return {
        dice,
        diceResult,
        globalResult
    };
}

function formatResult(dice: RollResult): string {
    const actualDice = dice.dice;
    let diceStr = `${actualDice.nbDices}d${actualDice.nbFaces}`;
    let modificator = '';
    if (actualDice.operand !== 0) modificator = `${actualDice.operator}${actualDice.operand}`;

    let resultStr: string = `${diceStr}${modificator}: (`;

    dice.diceResult.forEach(result => {
        if (result === actualDice.nbFaces || result === 1) {
            resultStr += `${ansis.blue(result.toString())}, `;
        } else {
            resultStr += `${result}, `;
        }
    });

    resultStr = resultStr.slice(0, -2);
    resultStr += `)${modificator} = ${dice.globalResult}`;

    return resultStr;
}

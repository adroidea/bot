import { Client, Events, Message } from 'discord.js';

export default {
    name: Events.MessageCreate,
    execute(client: Client, message: Message) {
        if (message.author.bot) return;
        let randomReact = Math.random();

        const sendReply = (content: string, percentage: number = 100) => {
            if (Math.random() > 1 - percentage / 100) {
                return message.reply(content);
            }
        };

        //Accepts (case insensitive) : i'm / i am / I be
        const englishDadRegex = /\bi(?:(?:\s+a|')?m|\s+be)\s+(?=\S)/i;
        //Accepts (case insensitive) : je suis / jsuis / j'suis
        const frenchDadRegex = /j(?:e+\s|')?suis/i;

        const handleDadReply = (regex: RegExp, replyTemplate: string, reactThreshold: number) => {
            const match = regex.exec(message.content);
            if (match && randomReact > 1 - reactThreshold / 100) {
                const input = message.content.slice(match.index + match[0].length).trim();
                const name = extractNameFromMessage(input);
                if (!name || name.length > 50) return false;
                return message.reply(replyTemplate.replace('${name}', name));
            }
        };

        switch (true) {
            case /\ballo\b/gi.test(message.content):
                return sendReply(
                    'https://cdn.discordapp.com/attachments/771934231647223848/932926764253052949/oui_allo_jegoutte.jpg'
                );

            case /hello there/gim.test(message.content):
                return sendReply(
                    'https://tenor.com/view/hello-there-general-kenobi-star-wars-grevious-gif-17774326'
                );

            case /jpp/gim.test(message.content):
                return sendReply(
                    'https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png',
                    20
                );

            case /quoi(\s|\.|\?|!|;|:|,|\/)*$/gim.test(message.content):
                return sendReply('feur <3', 15);

            case frenchDadRegex.test(message.content):
                return handleDadReply(frenchDadRegex, 'Salut ${name}, je suis ton père !', 15);

            case englishDadRegex.test(message.content):
                return handleDadReply(englishDadRegex, "Hi ${name}, I'm dad!", 15);
            default:
                return;
        }
    }
};

/**
 * Extracts a name from the given input string.
 * @param input The input string to extract the name from.
 * @returns The extracted name if found, otherwise the input string itself.
 */
const extractNameFromMessage = (input: string) => {
    const regex = /[(<^,.:;!?">)]|xd|md+d*r*|pour/im;
    const match = regex.exec(input);

    if (match) {
        const name = match[0].trim();
        return name;
    }
    return input;
};

import { Client, Events, Message } from 'discord.js';

module.exports = {
    name: Events.MessageCreate,
    execute(client: Client, message: Message) {
        if (message.author.bot) return;
        //Accepts (case insensitive) : i'm / i am / I be
        const englishDadRegex = /\bi(?:(?:\s+a|')?m|\s+be)\s+(?=\S)/i;
        const englishMatch = englishDadRegex.exec(message.content);
        //Accepts (case insensitive) : je suis / jsuis / j'suis
        const frenchDadRegex = /j(?:e+\s|')?suis/i;
        const frenchMatch = frenchDadRegex.exec(message.content);
        let randomReact = Math.random();
        switch (true) {
            case /\ballo\b/gi.test(message.content):
                return message.reply(
                    'https://cdn.discordapp.com/attachments/771934231647223848/932926764253052949/oui_allo_jegoutte.jpg'
                );

            case /hello there/gim.test(message.content):
                return message.reply(
                    'https://tenor.com/view/hello-there-general-kenobi-star-wars-grevious-gif-17774326'
                );

            case /jpp/gim.test(message.content):
                if (randomReact > 0.8) {
                    return message.reply(
                        'https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png'
                    );
                }
                return;

            case /quoi(\s|\.|\?|!|;|:|,|\/)*$/gim.test(message.content):
                if (randomReact > 0.8) {
                    return message.reply('feur <3');
                }
                return;

            case frenchDadRegex.test(message.content):
                if (randomReact > 0.6) {
                    const input = message.content
                        .slice(frenchMatch!.index + frenchMatch![0].length)
                        .trim();
                    const name = extractNameFromMessage(input);
                    if (!name || name.length > 100) return false;
                    return message.reply(`Salut ${name}, je suis ton père !`);
                }
                return;

            case englishDadRegex.test(message.content):
                if (randomReact > 0.5) {
                    const input = message.content
                        .slice(englishMatch!.index + englishMatch![0].length)
                        .trim();
                    const name = extractNameFromMessage(input);
                    if (!name || name.length > 100) return false;
                    return message.reply(`Hi ${name}, I'm dad!`);
                }
                return;
            default:
                return;
        }
    }
};

const extractNameFromMessage = (input: string) => {
    const regex = /[^,.:;!?)]+/im;
    const match = regex.exec(input);

    if (match) {
        const name = match[0].trim();
        return name;
    }

    return input;
};

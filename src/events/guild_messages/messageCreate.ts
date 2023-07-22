import { Client, Events, Message } from 'discord.js';

module.exports = {
    name: Events.MessageCreate,
    execute(client: Client, message: Message) {
        if (message.author.bot) return;
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
                if (randomReact > 0.80) {
                    return message.reply(
                        'https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png'
                    );
                }
                return;

            case /quoi/gim.test(message.content):
                if (randomReact > 0.80) {
                    return message.reply('feur <3');
                }
                return;

            case frenchDadRegex.test(message.content):
                if (randomReact > 0.9 && message.author.id !== '159638700316164096') {
                    const name = message.content
                        .slice(frenchMatch!.index + frenchMatch![0].length)
                        .trim();
                    if (!name || name.length > 100) return false;
                    return message.reply(`Salut ${name}, Je suis ton père !`);
                }
                return;
            default:
                return;
        }
    }
};

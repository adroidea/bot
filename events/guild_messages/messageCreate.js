module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        
        const englishDadRegex = /\bi(?:(?:\s+a|')?m|\s+be)\s+(?=\S)/i;
        const frenchDadRegex = /j(?:e+\s|')?suis/i;
        const englishMatch = message.content.match(englishDadRegex);
        const frenchMatch = message.content.match(frenchDadRegex);
        if (message.channel.id === '816168046183317505') {
            if (!message.author.bot) {
                let randomReact = Math.random();
                switch (true) {
                    case /\bAllo\b/gi.test(message.content):
                        return message.reply(
                            'https://cdn.discordapp.com/attachments/771934231647223848/932926764253052949/oui_allo_jegoutte.jpg'
                        );
                    case /hello there/gim.test(message.content):
                        return message.reply(
                            'https://tenor.com/view/hello-there-general-kenobi-star-wars-grevious-gif-17774326'
                        );
                    case /jpp/gim.test(message.content):
                        if (randomReact > 0.95) {
                            return message.reply(
                                'https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png'
                            );
                        }
                        return;
                    case frenchDadRegex.test(message.content):
                        if (randomReact > 0.9) {
                            const name = message.content
                                .slice(
                                    frenchMatch.index + frenchMatch[0].length
                                )
                                .trim();
                            if (!name || name.length > 100) return false;
                            return message.reply(
                                `Salut ${name}, Je suis ton père !`
                            );
                        }
                        return;
                    case englishDadRegex.test(message.content):
                        if (randomReact > 0.5) {
                            const name = message.content
                                .slice(
                                    englishMatch.index + englishMatch[0].length
                                )
                                .trim();
                            if (!name || name.length > 100) return false;
                            return message.reply(`Hi ${name}, I'm dad!`);
                        }
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

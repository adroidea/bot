const prefix = '!';
module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        if (message.author.bot) {
            return;
        }
        if (!message.content.startsWith(prefix)) {
            if (!message.author.bot) {
                const englishDadRegex = /\bi(?:(?:\s+a|')?m|\s+be)\s+(?=\S)/i;
                const frenchDadRegex = /j(?:e+\s|')?suis/i;
                const englishMatch = message.content.match(englishDadRegex);
                const frenchMatch = message.content.match(frenchDadRegex);
                let randomReact = Math.random();
                switch (true) {
                    case /Allo/gmi.test(message.content) :
                        return message.reply('https://cdn.discordapp.com/attachments/771934231647223848/932926764253052949/oui_allo_jegoutte.jpg');
                    case /hello there/gmi.test(message.content) :
                        return message.reply('https://tenor.com/view/hello-there-general-kenobi-star-wars-grevious-gif-17774326');
                    case /jpp/gmi.test(message.content) :
                        if (randomReact > 0.95) {
                            return message.reply('https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png');
                        }
                        return;
                    case frenchDadRegex.test(message.content):
                        if (randomReact > 0.9) {
                            const name = message.content.slice(frenchMatch.index + frenchMatch[0].length).trim();
                            if (!name || name.length > 100) return false;
                            return message.reply(`Salut ${name}, Je suis ton père !`);
                        }
                        return;
                    case englishDadRegex.test(message.content):
                        if (randomReact > 0.5) {
                            const name = message.content.slice(englishMatch.index + englishMatch[0].length).trim();
                            if (!name || name.length > 100) return false;
                            return message.reply(`Hi ${name}, I'm dad!`);
                        }
                        return;
                    default:
                        break;
                }

                let random = Math.random();
                if (random > 0.9 && message.author.id === '264026835493322753') {
                    return message.reply(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
                } else if (random > 0.99 && message.channel.id !== '816189987295854632') {
                    return message.reply(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
                }

            }
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmdName = args.shift().toLowerCase();
        if (cmdName.length === 0) {
            return;
        }

        let cmd = client.commands.get(cmdName);
        if(!message.member.permissions.has([cmd.permissions])) return message.reply('You are not allowed to use this command.')
        if (cmd) {
            cmd.run(client, message, args);
        }
    }
};

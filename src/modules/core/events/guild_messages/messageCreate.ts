import { Client, Events, Message } from 'discord.js';
import { Guilds } from '../../../../utils/consts';
import { randomizeArray } from '../../../twitchLive/tasks/twitchAlert.cron';

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

            case /JPPFC/gm.test(message.content):
                if (message.guildId === Guilds.LeMondeDLaure)
                    return sendReply(randomizeArray(jppfc));
                return;

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

const extractNameFromMessage = (input: string) => {
    const regex = /[(<^,.:;!?">)]|xd|md+d*r*|pour/im;
    const match = regex.exec(input);

    if (match) {
        const name = match[0].trim();
        return name;
    }
    return input;
};

const jppfc = [
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144537599847956480/19ftCdgqd95ngAAAABJRU5ErkJggg.png',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144538020888969227/7vm4j6.gif',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144538219174707311/hfmF1j1eh4lPYAAAAASUVORK5CYII.png',
    'https://tenor.com/view/carton-rouge-red-card-thats-a-red-red-card-ref-giving-red-card-gif-15384042',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144539662317256754/Q3JKwvgxTnUySRrfqpuTu4O4eHN5DB9Rz9gvHt5MDFtk1wAAAABJRU5ErkJggg.png',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144539882111369327/M8993eH47aP3HYb6CHzt8YV67QR6BxDQH1QDllyMlSlsTNBhZEp3xr7MYwAAAABJRU5ErkJggg.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144540074273407058/G3UFjgiagWGiAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144540418831294596/wdVW30fCIMuOwAAAABJRU5ErkJggg.png',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144540629318250536/A6D5yn325IKAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144540864429965434/p7x12gvAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144541302730522704/97VgEiOgMlyAAAAAElFTkSuQmCC.png',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144541605420871740/T3RMqFxAICAQEAgIBgeMhcHYJPZhmjteDIVVAICAQEAgIBASwqd7osE2XAzwBgYBAQCAgEBAICDw1CARCf2q6KlQ0IBAQCAgEBAIChyMQCD2MjoBAQCAgEBAICDwDCARCfwY6MTQhIBAQCAgEBAICgdDDGAgIBAQCAgGBgMAzgEAg9GegE0MTAgIBgYBAQCAg8P8BUKOwLArWAAAAABJRU5ErkJggg.png',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144542020795367474/80CtII0RRCdAAAAAElFTkSuQmCC.png',
    'https://cdn.discordapp.com/attachments/1144537559238721597/1144542527505055754/yKAhDH1zGkHQAAAABJRU5ErkJggg.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144542754718875749/sJpL3MIQ1QG4mUbkldjU6HHt0i7Pjw7YUQbxfxc4i3NzOyHMzvlyGVll6FGihWFSgBxHOCNrkUr5W5ESI4CRIDjw6jH8Mys4ihrFWAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144543156738732162/LxmgfkoW7LQpAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144543558716641301/44zNIMAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144543865693540474/6pgVWlVdDb4AAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144544067506683924/Be8C9yiIsVONAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144544579895435375/QbKwhXEyvbAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144545254821859368/g8csRPEWmiCTAAAAABJRU5ErkJggg.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144545523886460928/v8BcYUWbqg44QMAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144546362428493955/Qf3j4aOkmzEsQAAAABJRU5ErkJggg.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144546519463252010/D7vfKqm7n8eoWcfe5IZXQAAAABJRU5ErkJggg.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144546618918568058/f8HDc8NwbKsx24AAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144546704968908870/7bG88TQdjKkAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144546816436752414/lruLdQ5nT7vDxd71s6ghlZlWU4uHSMXKRLFqmeTDybP5tgTXvebD8OYvpWI44ZRQAdIO4utgAUnh20pQ7eHAi5J5mTElQUCi7hEYYXEqXI0VMIx1wX5fu69P8CWNVe7zhIBtIAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144547119793971220/jSJGRQqpDtXslblh71CrSccOEdJvrIGdT7LXc4Kk7Ufr8rMV8oRc6E4uZ0kWmxWpxPm1NL9bjSpmsWZwDlhMwaiZLxAsoIpysAe4vDaPY76UanqXgckMbFBcb5ttpsvY3ldqhCgxRv9IAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144547902996369428/mgAAAABJRU5ErkJggg.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144548014439010454/L8NQ4pkU4LqrAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144548065232044042/SCOnNxSulXtpHibq3QQFGovaU0xCpl4HkQAsah94Q1SGIZqkEDj0a6ENyEMveEjZeVjtvJ2Q4BncCPQzaqEkOBoxq6iOJlgQSgplOMtaO4FRQhfparWlIvkjN0Sgn74fgnjciWgyeD2ZmbNUZGcrLkRmv8L02Ssjc6SJcAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144548997625819256/MpavHHXsmdNzrkwB9TNEaevf6kSVOZvnFgE5SXOJx92eVQyoJ0Ouja8UyuKt4AGtUMxSVPzFZ8SoWv8HH5OlFRmCaXUAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144549210839064606/F7oZRDEs9NnAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144549550380556299/Fwspr4ybSz81kPnQHQwjenyxqc72n3s3Wdz1oN5yx8Ic6LHJOafMYxwOicoK592INOBxalaV1LlO7EQprRccHGbNRGGTbWuFU8suNFfONvH8WeQ4Po37gOKzauQ0DBmiygMuIEnuOqkmZmH61xfWEWTzWpZW1rVOV0aOhCdzYXbtGRqJ3HjIIpNKbzdWPKnd89NlyFK3EgKfeIgG54sGYMzLw6iv8Fz83Dp5uP9AwAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144549865653817394/ZIogEYmsAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144550321885036564/qVOnTuJYjp4YH3zlgzvwwR344A58cAcuAMf3IEP7sAPeQfD3vxyoYLCnjfAAAAAElFTkSuQmCC.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144550171577958410/YCaxYgCzqswG6qLkO8onmT8lcgLY2rmc8ytZi7iTIIMH3SEeKtpp2ngyrwO96P8BlHEbUfFpoucAAAAASUVORK5CYII.png',
    'https://media.discordapp.net/attachments/1144537559238721597/1144550139881603132/bNYE0XRaTkgAAAABJRU5ErkJggg.png'
];

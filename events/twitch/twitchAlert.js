const { GUILD, LIVE_CHANNEL } = require('../../utils/config');
const { EmbedBuilder } = require('discord.js');
const TwitchApi = require('node-twitch').default;

//Connection to the Twitch API. Used to get informations about the stream.
const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

let sleep = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let randomizeArray = array => {
    let randomNumber = Math.floor(Math.random() * array.length);
    return array[randomNumber];
};

let IsLiveMemory = false;

let currentGame = '';

/**
 * Sends a message on Discord whenever i go on live
 * @param {Client} client The main hub for interacting with the Discord API, and the starting point for the bot.
 */
let run = async client => {
    await twitch.getStreams({ channel: 'adan_ea' }).then(async data => {
        const r = data.data[0];
        let liveChannel = client.guilds.cache.get(GUILD);
        const guildPic = await client.getGuild(liveChannel);
        const sentMessage = client.channels.cache.get(LIVE_CHANNEL);
        if (r !== undefined) {
            if (r.type === 'live') {
                if (IsLiveMemory === false || IsLiveMemory === undefined) {
                    const embed = new EmbedBuilder()
                        .setTitle(`${r.title}`)
                        .setURL(`https://twitch.tv/${r.user_name}`)
                        .setDescription(
                            `**${r.user_name} est en live pour ${r.viewer_count} bg ultimes !**`
                        )
                        .addFields([
                            {
                                name: `**Jeu**`,
                                value: r.game_name,
                                inline: false
                            }
                        ])
                        .setImage(`${r.getThumbnailUrl()}?r=${r.id}?`)
                        .setColor('#b02020');
                    sentMessage.send({
                        content: `<@&930051152987430952>, ${
                            r.user_name
                        } ${randomizeArray(liveStart)} **__${r.game_name}__**.`,
                        embeds: [embed]
                    });
                    await liveChannel.setIcon(guildPic.liveProfilePicture);
                    IsLiveMemory = true;
                    currentGame = r.game_name;
                    await sleep(900000);
                }
                if (r.game_name !== currentGame) {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            `${randomizeArray(
                                gameChangePartOne
                            )} **${currentGame}**. ${randomizeArray(
                                gameChangePartTwo
                            )} **${r.game_name}**. ${randomizeArray(
                                gameChangePartThree
                            )}`
                        )
                        .setColor('#b02020');
                    sentMessage.send({ embeds: [embed] });
                    currentGame = r.game_name;
                }
            } else {
                if (IsLiveMemory === true) {
                    await liveChannel.setIcon(guildPic.defaultProfilePicture);
                    IsLiveMemory = false;
                    currentGame = '';
                }
            }
        } else if (IsLiveMemory === true) {
            await liveChannel.setIcon(guildPic.defaultProfilePicture);
            IsLiveMemory = false;
            currentGame = '';
        }
    });
};

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        while (true) {
            await run(client);
            await sleep(60000);
        }
    }
};

const liveStart = [
    'vient tout juste de lancer un stream ! Viens pour voir du',
    'stream actuellement, il manque plus que toi. Rejoins nous pour du',
    'a enfin lancé son stream ! Go prendre tes snacks et regarder du',
    "est enfin en live ! J'espère que t'as de quoi manger pour regarder du",
    'vient de lancer son stream, alors ramène ton petit boule qui chamboule pour du',
    'est en live ! Rejoins le pour du',
    'va te montrer ses skills (ou pas) en stream ! Viens vite pour ne pas le rater sur',
    'est pas là! Mais il est où ? Bah sur',
    "vient d'arriver ksksks, et si toi aussi tu arrivais ? On va tous s'amuser sur",
    'a une absence incroyable de skill à te présenter sur',
    "a ou n'a pas un burger chèvre miel, à toi de le découvrir en venant, tu pourras profiter pour regarder du non skill sur",
    "Viens. C'est pas une demande, c'est un ordre",
    'est en direct pour vous offrir des moments de folie. Lâchez tout ce que vous faites pour',
    'est sur le point de vous en mettre plein les yeux sur',
    "est en direct. C'est le moment de laisser votre journée de côté et de vous plonger dans l'aventure",
    "est là pour vous si vous êtes à la recherche d'une dose de divertissement sur",
    "est en live ! C'est l'heure de laisser la réalité derrière toi et de plonger dans le monde de"
];

const gameChangePartOne = [
    'Bon, on a eu marre de faire du',
    'Votre streamer vient tout juste de rage quit',
    'On veut plus faire de',
    'On a été fatigué par',
    'Le petit alt f4 des familles a été fait sur',
    "On suit le planning (ca m'étonnerai que ce soit vrai) donc on quitte",
    'Adieu',
    'Au revoir',
    'Après avoir dit au revoir à',
    'Dernier round pour',
    'Notre voyage touche à sa fin sur',
    "L'heure est venue de dire au revoir à"
];

const gameChangePartTwo = [
    'On passe sur',
    'On va donc faire un petit tour sur',
    'En échange ca te tente un peu de',
    'Place au prochain jeu :',
    'On accueille à bras ouverts',
    'Changeons pour',
    'Préparons-nous pour',
    'Le moment est venu de jouer à',
    'Nouveau jeu, nouveaux défis :'
];

const gameChangePartThree = [
    "(Adan est pas fou en vrai sur ça, mais on l'aime bien quand même)",
    'Quelle aventure nous attend cette fois-ci ?',
    'Prêts ?',
    'Accrochez-vous, ça va être intense.',
    'Préparez-vous à une nouvelle aventure.',
    'Préparez-vous pour un divertissement de haut niveau',
    '',
    '',
    '',
    ''
];

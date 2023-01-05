const { MessageEmbed } = require('discord.js');
const TwitchApi = require('node-twitch').default;

//Connection to the Twitch API. Used to get informations about the stream.
const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

let sleep = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let randomize = array => {
    let randomNumber = Math.floor(Math.random() * array.length);
    return array[randomNumber];
}

//Used to find out what the status of the stream is.
let IsLiveMemory = false;

const partOne = [
    "Bon, on a eu marre de faire du",
    "Votre streamer vient tout juste de rage quit",
    "On veut plus faire de"
];

const partTwo = [
    "Du coup on passe sur",
    "On va donc faire un petit tour sur"
];
const partThree = [
    "(Adan est pas fou en vrai sur ça, mais on l'aime bien quand même)",
    ""
]

//Used to find out what game is currently played, if a game is played.
let currentGame = "";
/**
 * Sends a message on Discord whenever i go on live
 * @param {Client} client The main hub for interacting with the Discord API, and the starting point for the bot.
 */
let run = async (client) => {
    await twitch.getStreams({ channel: 'adan_ea' }).then(async data => {
        const r = data.data[0];
        let liveChannel = client.guilds.cache.get(
            process.env.DISCORD_DEV_GUILD
            );
            const guildPic = await client.getGuild(liveChannel);
            const sentMessage = client.channels.cache.get('949252153225150524');
        if (r !== undefined) {
            if (r.type === 'live') {
                if (IsLiveMemory === false || IsLiveMemory === undefined) {
                    const embed = new MessageEmbed()
                        .setTitle(`${r.title}`)
                        .setURL(`https://twitch.tv/${r.user_name}`)
                        .setDescription(
                            `**${r.user_name} est en live pour ${r.viewer_count} viewers !**`
                        )
                        .addField(`**Jeu**`, r.game_name, false)
                        .setImage(`${r.getThumbnailUrl()}?${r.id}?${r.id}`)
                        .setColor('#b02020');
                    sentMessage.send({
                        content: `<@&930051152987430952> ${r.user_name} est en live ! Rejoins le pour du ${r.game_name}`,
                        embeds: [embed]
                    });
                    await liveChannel.setIcon(guildPic.liveProfilePicture);
                    IsLiveMemory = true;
                    currentGame = r.game_name;
                    await sleep(900000);
                } 
                if(r.game_name !== currentGame) {
                    sentMessage.send(`${randomize(partOne)} **__${currentGame}__**. ${randomize(partTwo)} **__${r.game_name}__** ! ${randomize(partThree)}`);
                    currentGame = r.game_name;
                    
                }
            } else {
                if (IsLiveMemory === true) {
                    await liveChannel.setIcon(
                        guildPic.defaultProfilePicture
                    );
                    IsLiveMemory = false;
                    currentGame = "";
                }
            }
        } else if (IsLiveMemory === true) {
            await liveChannel.setIcon(guildPic.defaultProfilePicture);
            IsLiveMemory = false;
            currentGame = "";
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

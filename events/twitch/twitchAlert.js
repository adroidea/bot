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

//Used to find out what the status of the stream is.
let IsLiveMemory = false;

/**
 * Sends a message on Discord whenever i go on live
 * @param {Client} client The main hub for interacting with the Discord API, and the starting point for the bot.
 */
let run = async (client, guildSettings) => {
    await twitch.getStreams({ channel: 'adan_ea' }).then(async data => {
        const r = data.data[0];
        let liveChannel = client.guilds.cache.get('814621177770541076');
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
                        .setImage(r.getThumbnailUrl())
                        .setColor('#b02020');
                    const sentMessage =
                        client.channels.cache.get('856293901237616640');
                    sentMessage.send({
                        content: `<@&930051152987430952> ${r.user_name} est en live ! Rejoins le pour du ${r.game_name}`,
                        embeds: [embed]
                    });
                    await liveChannel.setIcon(guildSettings.liveProfilePicture);
                    IsLiveMemory = true;
                    await sleep(900000);
                }
            } else {
                if (IsLiveMemory === true) {
                    await liveChannel.setIcon(guildSettings.defaultProfilePicture);
                    IsLiveMemory = false;
                }
            }
        } else {
            if (IsLiveMemory === true) {
                await liveChannel.setIcon(guildSettings.defaultProfilePicture);
                IsLiveMemory = false;
            }
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

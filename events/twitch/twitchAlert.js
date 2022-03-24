const {MessageEmbed} = require('discord.js');
const TwitchApi = require('node-twitch').default;

const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let IsLiveMemory = false;

async function run(client) {
    await twitch.getStreams({channel: 'adroid_ea'}).then(async data => {
        const r = data.data[0];
        let liveChannel = client.guilds.cache.get('605053128148254724');
        if (r !== undefined) {
            if (r.type === 'live') {
                if (IsLiveMemory === false || IsLiveMemory === undefined) {
                    const embed = new MessageEmbed()
                        .setTitle(`${r.title}`)
                        .setURL(`https://twitch.tv/${r.user_name}`)
                        .setDescription(`**${r.user_name} is live for ${r.viewer_count} viewers !**`)
                        .addField(`**Game**`, r.game_name, false)
                        .setImage(r.getThumbnailUrl())
                        .setColor('#b02020');
                    const sentMessage = client.channels.cache.get('949252153225150524').send({
                        content: `<@&930051152987430952> ${r.user_name} is live ! Join them for some ${r.game_name}`,
                        embeds: [embed]
                    });
                    await liveChannel.setIcon('https://cdn.discordapp.com/attachments/771934231647223848/946326723593633792/Peace_was_never_an_option.png');
                    IsLiveMemory = true;
                }
            } else {
                if (IsLiveMemory === true) {
                    await liveChannel.setIcon('https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png');
                    IsLiveMemory = false;
                }
            }
        } else {
            if (IsLiveMemory === true) {
                await liveChannel.setIcon('https://cdn.discordapp.com/attachments/771934231647223848/938389858802606160/jpp_jean-pierre.png');
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

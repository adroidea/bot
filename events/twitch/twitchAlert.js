const { MessageEmbed } = require('discord.js');
const TwitchApi = require('node-twitch').default;

const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

let sleep = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

let IsLiveMemory = false;

let run = async client => {
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
                    await liveChannel.setIcon(
                        'https://cdn.discordapp.com/attachments/763373900171313162/957985745258315836/icone-discord-live.png'
                    );
                    IsLiveMemory = true;
                    await sleep(900000);
                }
            } else {
                if (IsLiveMemory === true) {
                    await liveChannel.setIcon(
                        'https://cdn.discordapp.com/attachments/763373900171313162/957985780322664449/icone-discord.png'
                    );
                    IsLiveMemory = false;
                }
            }
        } else {
            if (IsLiveMemory === true) {
                await liveChannel.setIcon(
                    'https://cdn.discordapp.com/attachments/763373900171313162/957985780322664449/icone-discord.png'
                );
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

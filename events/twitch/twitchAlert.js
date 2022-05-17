const { MessageEmbed } = require('discord.js');
const TwitchApi = require('node-twitch').default;

const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let IsLiveAdanMemory = false;

async function editStreamingRole(client, streamer, memberId) {
    twitch.getStreams({ channel: streamer }).then(async data => {
        let roleId = '948895921482113024';
        const r = data.data[0];
        let streamer = await client.guilds.cache
            .get('814621177770541076')
            .members.cache.get(memberId);
        if (r !== undefined) {
            if (r.type === 'live') {
                if (streamer.roles.cache.get(roleId) === undefined)
                    streamer.roles.add(roleId);
            } else {
                if (streamer.roles.cache.get(roleId) !== undefined)
                    streamer.roles.remove(roleId);
            }
        } else {
            if (streamer.roles.cache.get(roleId) !== undefined)
                streamer.roles.remove(roleId);
        }
    });
}

async function run(client) {
    await twitch.getStreams({ channel: 'adan_ea' }).then(async data => {
        const r = data.data[0];
        let liveChannel = client.guilds.cache.get('814621177770541076');
        if (r !== undefined) {
            if (r.type === 'live') {
                if (
                    IsLiveAdanMemory === false ||
                    IsLiveAdanMemory === undefined
                ) {
                    const embed = new MessageEmbed()
                        .setTitle(`${r.title}`)
                        .setURL(`https://twitch.tv/${r.user_name}`)
                        .setDescription(
                            `**${r.user_name} is live for ${r.viewer_count} viewers !**`
                        )
                        .addField(`**Game**`, r.game_name, false)
                        .setImage(r.getThumbnailUrl())
                        .setColor('#b02020');
                    const sentMessage = client.channels.cache
                        .get('856293901237616640')
                        .send({
                            content: `<@&930051152987430952> ${r.user_name} is live ! Join them for some ${r.game_name}`,
                            embeds: [embed]
                        });
                    await liveChannel.setIcon(
                        'https://cdn.discordapp.com/attachments/763373900171313162/957985745258315836/icone-discord-live.png'
                    );
                    IsLiveAdanMemory = true;
                    await sleep(900000);
                }
            } else {
                if (IsLiveAdanMemory === true) {
                    await liveChannel.setIcon(
                        'https://cdn.discordapp.com/attachments/763373900171313162/957985780322664449/icone-discord.png'
                    );
                    IsLiveAdanMemory = false;
                }
            }
        } else {
            if (IsLiveAdanMemory === true) {
                await liveChannel.setIcon(
                    'https://cdn.discordapp.com/attachments/763373900171313162/957985780322664449/icone-discord.png'
                );
                IsLiveAdanMemory = false;
            }
        }
    });
}

const streamers = [
    {
        streamer: 'boukx',
        memberId: '285380909090471936'
    },
    {
        streamer: 'cobaltv',
        memberId: '164431044542464000'
    },
    {
        streamer: 'flolleli',
        memberId: '212242024005369856'
    },
    {
        streamer: 'igua30',
        memberId: '728570505107341313'
    },
    {
        streamer: 'Lazerlz',
        memberId: '180050877925687296'
    },
    {
        streamer: 'lemondedlaure',
        memberId: '360671572299743232'
    },
    {
        streamer: 'nathwolf',
        memberId: '283732823838294025'
    },
    {
        streamer: 'usishiiire',
        memberId: '538079101077028868'
    },
    {
        streamer: 'yookie_tv',
        memberId: '131172720296722433'
    },
    {
        streamer: 'zennf_',
        memberId: '159638700316164096'
    }
];

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        while (true) {
            await run(client);
            for (let streamer of streamers) {
                await editStreamingRole(
                    client,
                    streamer.streamer,
                    streamer.memberId
                );
                await sleep(10000);
            }
            await sleep(60000);
        }
    }
};

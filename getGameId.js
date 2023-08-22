const TwitchApi = require('node-twitch').default;
require('dotenv').config();

const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

async function getStreams() {
    const streams = await twitch.getStreams({
        channels: ['haelynah']
    });
    return streams;
}

getStreams().then(data => {
    for (const stream of data.data) {
        console.log(`${stream.game_name}: ${stream.game_id}`);
    }
});

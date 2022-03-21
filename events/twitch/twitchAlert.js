const {MessageEmbed} = require('discord.js');
const TwitchApi = require('node-twitch').default;

const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

async function getStream() {
    const streams = await twitch.getStreams({channel: 'tatalyssia'});
    return streams.data[0];
}

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if (message.content === 'test') {
            const r = await getStream();
            const embed = new MessageEmbed()
                .setTitle(`${r.title}`)
                .setURL(`https://twitch.tv/${r.user_name}`)
                .setDescription(`**${r.user_name} is live for ${r.viewer_count} viewers !**`)
                .addField(`**Game**`, r.game_name, false)
                .setImage(r.getThumbnailUrl())
                .setColor('#b02020');
            //TODO: find how to send a message and an embed together
            await message.channel.send(`<@&930051152987430952> ${r.user_name} is live ! Join them for some ${r.game_name}`, {embeds: [embed]});
        }
    }
};

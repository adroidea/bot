const {MessageEmbed} = require('discord.js');
const TwitchApi = require('node-twitch').default;

const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
});

async function getStream() {
    const streams = await twitch.getStreams({channel: 'igua30'});
    console.log(streams.data[0].thumbnail_url);
    return streams.data[0];
}

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {

        if (message.content === 'test') {
            //`${r.user_name} is live on ${r.game_name} for ${r.viewer_count} viewers`
            getStream().then(r => {
                const embed = new MessageEmbed()
                    .setTitle(`${r.title}`)
                    .setURL(`https://twitch.tv/${r.user_name}`)
                    .setThumbnail(r.thumbnail_url)
                    .setDescription(`adan_ea is live !`)
                    .addField(`**Game**`, r.game_name, false)
                    .setColor('#b02020');
                message.channel.send(`<@&930051152987430952> ${r.user_name} est en live ! Rejoignez le sur ${r.game_name}`, {embeds: [embed]});
            });

        }
    }
};

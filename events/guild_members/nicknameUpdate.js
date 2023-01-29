const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    /**
     * Event triggered when a user changes their nickname. When triggered, sends a log message in the private log channel.
     * @param {Client} client - The main hub for interacting with the Discord API, and the starting point for the bot.
     * @param {GuildMember} member - Represents a member of a guild on Discord.
     */
    async execute(client, oldMember, newMember) {
        const fetchGuild = await client.getGuild(oldMember.guild);
        const logChannel = client.channels.cache.get(
            fetchGuild.privateLogChannel
        );
        if (oldMember.nickname !== newMember.nickname) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${newMember.user.tag}`,
                    iconURL: newMember.avatarURL()
                })
                .setDescription(`<@${newMember.id}> a changé de pseudo`)
                .addFields([
                    {
                        name: 'Ancien',
                        value:
                            oldMember.nickname !== null
                                ? oldMember.nickname
                                : oldMember.user.username,
                        inline: false
                    },
                    {
                        name: 'Nouveau',
                        value:
                            newMember.nickname !== null
                                ? newMember.nickname
                                : newMember.user.username,
                        inline: false
                    }
                ])
                .setColor('#20B068')
                .setFooter({ text: `ID: ${newMember.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    }
};

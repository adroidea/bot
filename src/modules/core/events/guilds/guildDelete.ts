import { Client, Events, Guild } from 'discord.js';
import guildService from '../../../../services/guildService';

module.exports = {
    name: Events.GuildDelete,
    async execute(client: Client, guild: Guild) {
        guildService.deleteGuild(guild.id);
    }
};

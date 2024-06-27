import { Client, Events, Guild } from 'discord.js';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.GuildDelete,
    async execute(_: Client, guild: Guild) {
        guildService.deleteGuild(guild.id);
    }
};

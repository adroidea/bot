import { Client, Events, Guild } from 'discord.js';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildDelete,
    async execute(client: Client, guild: Guild) {
        guildService.deleteGuild(guild.id);
    }
};

import { Client, Events, Guild } from 'discord.js';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildCreate,
    async execute(client: Client, guild: Guild) {
        guildService.createGuild(guild.id);
    }
};

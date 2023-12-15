import { Client, Events, Guild } from 'discord.js';
import { IGuild } from '../../../../models';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildUpdate,
    async execute(client: Client, oldGuild: Guild, newGuild: Guild) {
        let update: Partial<IGuild> = {};

        if (oldGuild.banner !== newGuild.banner) update.banner = newGuild.banner;
        if (oldGuild.name !== newGuild.name) update.name = newGuild.name;
        if (oldGuild.icon !== newGuild.icon) update.icon = newGuild.icon;

        await guildService.updateGuild(newGuild, update);
    }
};

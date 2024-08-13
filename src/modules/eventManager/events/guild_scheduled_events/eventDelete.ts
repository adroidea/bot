import { Client, Events, GuildScheduledEvent } from 'discord.js';
import { IGuild } from 'adroi.d.ea';
import { eventCanceled } from './eventUpdate';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.GuildScheduledEventDelete,
    async execute(_: Client, event: GuildScheduledEvent) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(event.guild!);

        const { eventManager } = guildSettings.modules;
        if (!eventManager.enabled) return;
        eventCanceled(event);
    }
};

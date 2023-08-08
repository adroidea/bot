import { Client, Events, GuildScheduledEvent } from 'discord.js';
import { IGuild } from '../../../../models';
import { eventCanceled } from './eventUpdate';
import guildService from '../../../../services/guildService';

module.exports = {
    name: Events.GuildScheduledEventDelete,
    async execute(client: Client, event: GuildScheduledEvent) {
        const guildSettings: IGuild = await guildService.getorCreateGuild(event.guildId);

        const eventManagement = guildSettings.modules.eventManagement;
        if (!eventManagement.enabled) return;
        eventCanceled(event);
    }
};

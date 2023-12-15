import { Client, Events, GuildScheduledEvent } from 'discord.js';
import { IGuild } from '../../../../models';
import { eventCanceled } from './eventUpdate';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildScheduledEventDelete,
    async execute(client: Client, event: GuildScheduledEvent) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(event.guild!);

        const eventManagement = guildSettings.modules.eventManagement;
        if (!eventManagement.enabled) return;
        eventCanceled(event);
    }
};

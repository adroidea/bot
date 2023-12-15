import { Client, Events, GuildScheduledEvent, TextBasedChannel, User } from 'discord.js';
import { IGuild } from '../../../../models';
import ScheduledEventService from '../../services/scheduledEventService';
import guildService from '../../../../services/guildService';

export default {
    name: Events.GuildScheduledEventUserAdd,
    async execute(client: Client, event: GuildScheduledEvent, user: User) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(event.guild!);

        const eventManagement = guildSettings.modules.eventManagement;
        if (!eventManagement.enabled) return;

        const savedEvent = await ScheduledEventService.addParticipantToEvent(event.id, user.id);
        if (!savedEvent) return;

        const messageChannel = await client.channels.fetch(savedEvent.channelId);
        const message = await (messageChannel as TextBasedChannel)?.messages.fetch(
            savedEvent.messageId
        );
        if (!message) return;
        const inviteURL = await event.createInviteURL({ maxAge: 0, unique: false });
        const description = ScheduledEventService.updateMessage(savedEvent) + '\n\n' + inviteURL;

        message.edit({ content: description });
    }
};

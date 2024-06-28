import { Client, Events, GuildScheduledEvent, User } from 'discord.js';
import EventManagerService from '../../services/eventManager.service';
import { IGuild } from 'adroi.d.ea';
import { getTextChannel } from '../../../../utils/bot.util';
import guildService from '../../../../services/guild.service';

export default {
    name: Events.GuildScheduledEventUserRemove,
    async execute(_: Client, event: GuildScheduledEvent, user: User) {
        const guildSettings: IGuild = await guildService.getOrCreateGuild(event.guild!);

        const eventManager = guildSettings.modules.eventManager;
        if (!eventManager.enabled) return;

        const savedEvent = await EventManagerService.removeParticipantFromEvent(event.id, user.id);
        if (!savedEvent) return;

        const messageChannel = getTextChannel(event.guild!, savedEvent.channelId);
        const message = await messageChannel.messages.fetch(savedEvent.messageId);
        if (!message) return;
        const inviteURL = await event.createInviteURL({ maxAge: 0, unique: false });
        const description = EventManagerService.updateMessage(savedEvent) + '\n\n' + inviteURL;

        message.edit({ content: description });
    }
};

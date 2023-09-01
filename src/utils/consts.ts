import { ColorResolvable } from 'discord.js';

export const Colors: { [key: string]: ColorResolvable } = {
    client: [0, 255, 255],
    error: [255, 0, 0],
    info: [0, 0, 255],
    success: [0, 255, 0],
    warning: [255, 255, 0],
    red: [176, 32, 32],
    twitch: [145, 70, 255],
    kick: [0, 231, 1],
    random: 'Random'
};

export const Modules = {
    core: {
        name: 'core',
        label: 'Base',
        description: 'Module de base',
        emoji: '📦'
    },
    party: {
        name: 'party',
        label: 'Party',
        description: 'Module de la party',
        emoji: '🎉'
    },
    qotd: {
        name: 'qotd',
        label: 'Question du Jour',
        description: 'Module de la question du jour',
        emoji: '❓'
    },
    scheduledEvents: {
        name: 'scheduled_events',
        label: 'Evenements',
        description: 'Module de gestion des événements',
        emoji: '📅'
    },
    swiftVoice: {
        name: 'swift_voice',
        label: 'SwiftVoice',
        description: 'Module de SwiftVoice',
        emoji: '🎤'
    },
    twitch: {
        name: 'twitch',
        label: 'Twitch',
        description: 'Module Twitch',
        emoji: '📺'
    }
};

export const OWNER_ID = '294916386072035328';
export const OWNER_SERVER_ID = '605053128148254724';
export const LOG_CHANNEL_ID = '949252153225150524';

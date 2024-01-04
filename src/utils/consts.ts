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

export interface IModule {
    name: string;
    label: string;
    description: string;
    emoji: string;
}

export const Modules: { [key: string]: IModule } = {
    core: {
        name: 'core',
        label: 'Base',
        description: 'Module de base',
        emoji: '📦'
    },
    auditLogs: {
        name: 'auditLogs',
        label: 'Audit Logs',
        description: 'Module de logs',
        emoji: '📜'
    },
    // party: {
    //     name: 'party',
    //     label: 'Party',
    //     description: 'Module de la party',
    //     emoji: '🎉'
    // },
    qotd: {
        name: 'qotd',
        label: 'Question du Jour',
        description: 'Module de la question du jour',
        emoji: '❓'
    },
    // scheduledEvents: {
    //     name: 'scheduledEvents',
    //     label: 'Evenements',
    //     description: 'Module de gestion des événements',
    //     emoji: '📅'
    // },
    tempVoice: {
        name: 'tempVoice',
        label: 'tempVoice',
        description: 'Module de tempVoice',
        emoji: '🎤'
    },
    twitch: {
        name: 'twitch',
        label: 'Twitch',
        description: 'Module Twitch',
        emoji: '📺'
    }
};

export const Guilds = {
    adanLab: '1131215407559213188',
    adan_ea: '814621177770541076',
    LeMondeDLaure: '743969889177436211'
};

export const Channels = {
    logsThread: '1138134483149795390',
    stealQDJ: '949252153225150524',
    issues: '1159452960825286728'
};

export const OWNER_ID = '294916386072035328';

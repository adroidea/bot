import { ColorResolvable } from 'discord.js';

export const Colors: Record<string, ColorResolvable> = {
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

export enum Emojis {
    check = '✅',
    cross = '❌',
    snowflake = '❄️',
    aSnowflake = '<a:flocon:1177616024959455242>',
    pikaHi = '<a:pikaHi:960872476718551070>',

    // Audit Logs
    aCheck = '<a:check:1194269260600574122>',
    aCross = '<a:cross:1194269188567605308>',
    advanced = '<:moderator_shield:1194570073579474964>',
    cog = '<:cog:1194648534197207100>',
    event = '<:event:1194570074938413086>',
    link = '<:link:1194640237519970304>',
    members = '<:members:1194570078449057863>',
    mention = '<:mention:1194638583722684456>',
    roles = '<:roles:1194641336238874644>',
    stageChannel = '<:stage_channel:1194570076402241597>',
    textChannel = '<:text_channel:1194570071654277210>',
    voiceChannel = '<:voice_channel:1194569512461287564>'
}

export interface IModule {
    name: string;
    label: string;
    description: string;
    emoji: string;
}

export const Modules: Record<string, IModule> = {
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
    jail: {
        name: 'jail',
        label: 'Jail',
        description: 'Module de la prison',
        emoji: '🔒'
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

export enum Guilds {
    adanLab = '1131215407559213188',
    adan_ea = '814621177770541076',
    LeMondeDLaure = '743969889177436211'
}

export enum Channels {
    logsThread = '1138134483149795390',
    stealQDJ = '949252153225150524',
    issues = '1159452960825286728'
}

export const OWNER_ID = '294916386072035328';

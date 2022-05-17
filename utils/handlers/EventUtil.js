const { promisify } = require('util');
const { glob } = require('glob');
const Logger = require('../Logger');

const pGlob = promisify(glob);

let nbEvents = 0;
let nbFailedEvents = 0;

module.exports = async client => {
    (await pGlob(`${process.cwd()}/events/*/*.js`)).map(async eventFile => {
        const event = require(eventFile);

        if (!event.name) {
            nbFailedEvents++;
            return Logger.warn(
                `Not initialised Event: NAME required but missing\nFile : ${eventFile}`
            );
        }
        if (!eventList.includes(event.name)) {
            nbFailedEvents++;
            return Logger.typo(
                `Not initialised Event: EVENT ${event.name} unknown.\nFile : ${eventFile}`
            );
        }

        if (event.once) {
            client.once(event.name, (...args) =>
                event.execute(client, ...args)
            );
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }

        nbEvents++;
    });
    if (nbEvents !== 0) await Logger.info(`${nbEvents} events loaded. `);
    if (nbFailedEvents !== 0)
        await Logger.warn(`Failed to load ${nbFailedEvents} events. `);
};

const eventList = [
    'apiRequest',
    'apiResponse',
    'applicationCommandCreate',
    'applicationCommandDelete',
    'applicationCommandUpdate',
    'channelCreate',
    'channelDelete',
    'channelPinsUpdate',
    'channelUpdate',
    'debug',
    'emojiCreate',
    'emojiDelete',
    'emojiUpdate',
    'error',
    'guildBanAdd',
    'guildBanRemove',
    'guildCreate',
    'guildDelete',
    'guildIntegrationsUpdate',
    'guildMemberAdd',
    'guildMemberAvailable',
    'guildMemberRemove',
    'guildMembersChunk',
    'guildMemberUpdate',
    'guildScheduledEventCreate',
    'guildScheduledEventDelete',
    'guildScheduledEventUpdate',
    'guildScheduledEventUserAdd',
    'guildScheduledEventUserRemove',
    'guildUnavailable',
    'guildUpdate',
    'interaction',
    'interactionCreate',
    'invalidated',
    'invalidRequestWarning',
    'inviteCreate',
    'inviteDelete',
    'message',
    'messageCreate',
    'messageDelete',
    'messageDeleteBulk',
    'messageReactionAdd',
    'messageReactionRemove',
    'messageReactionRemoveAll',
    'messageReactionRemoveEmoji',
    'messageUpdate',
    'presenceUpdate',
    'rateLimit',
    'ready',
    'roleCreate',
    'roleDelete',
    'roleUpdate',
    'shardDisconnect',
    'shardError',
    'shardReady',
    'shardReconnecting',
    'shardResume',
    'stageInstanceCreate',
    'stageInstanceDelete',
    'stageInstanceUpdate',
    'stickerCreate',
    'stickerDelete',
    'stickerUpdate',
    'threadCreate',
    'threadDelete',
    'threadListSync',
    'threadMembersUpdate',
    'threadMemberUpdate',
    'threadUpdate',
    'typingStart',
    'userUpdate',
    'voiceStateUpdate',
    'warn',
    'webhookUpdate'
];

const {promisify} = require('util');
const {glob} = require('glob');

const pGlob = promisify(glob);

let nbEvents = 0;
let nbFailedEvents = 0;

module.exports = async client => {
    (await pGlob(`${process.cwd()}/events/*/*.js`)).map(async eventFile => {
        const event = require(eventFile);

        if (!eventList.includes(event.name) || !event.name) {
            nbFailedEvents++;
            return console.log(`-----\nNot initialised Event: Double check the name\n File : ${eventFile}\n-----`);
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }

        nbEvents++;
    });
    if (nbEvents !== 0) await console.log(`${nbEvents} events loaded. `);
    if (nbFailedEvents !== 0) await console.log(`Failed to load ${nbFailedEvents} events. `);
};

const eventList = ['apiRequest', 'apiResponse', 'applicationCommandCreate', 'applicationCommandDelete',
    'applicationCommandUpdate', 'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate',
    'debug', 'emojiCreate', 'emojiDelete', 'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove',
    'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildMemberAdd', 'guildMemberAvailable',
    'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate', 'guildScheduledEventCreate',
    'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd',
    'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interaction', 'interactionCreate',
    'invalidated', 'invalidRequestWarning', 'inviteCreate', 'inviteDelete', 'message', 'messageCreate',
    'messageDelete', 'messageDeleteBulk', 'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll',
    'messageReactionRemoveEmoji', 'messageUpdate', 'presenceUpdate', 'rateLimit', 'ready', 'roleCreate',
    'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting',
    'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate', 'stickerCreate',
    'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate',
    'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpdate'];

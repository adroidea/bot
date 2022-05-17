const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
let nbCmd = 0;
let nbFailedCmd = 0;

module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        if (!cmd.name || (!cmd.description && cmd.type !== 'USER')) {
            nbFailedCmd++;
            return console.log(`-----\nNot initialised Command:\n Possible reasons :\n 1. Double check the name\n 2. A description is required \n File : ${cmdFile}\n-----`);
        }
        if (!cmd.permissions) {
            nbFailedCmd++;
            return console.log(`-----\nNot initialised Command:\n Permissions required but missing. \n File : ${cmdFile}\n-----`);
        }

        cmd.permissions.forEach(permission => {
            if (!permissionList.includes(permission)) {
                nbFailedCmd++;
                return console.log(`-----\nNot initialised Command: Double check the permissions, this one in particular : ${permission} \n File : ${cmdFile}\n-----`);
            }
        });

        nbCmd++;
        await client.commands.set(cmd.name, cmd);

    });
    if (nbCmd !== 0) await console.log(`${nbCmd} commands loaded.`);
    if (nbFailedCmd !== 0) await console.log(`Failed to load ${nbFailedCmd} commands`);
};


const permissionList = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS',
    'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES',
    'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHTS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS',
    'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS',
    'USE_APPLICATION_COMMANDS', 'REQUEST_TO_SPEAK', 'MANAGE_EVENTS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS',
    'CREATE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'CREATE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS',
    'SEND_MESSAGES_IN_THREADS', 'START_EMBEDDED_ACTIVITIES', 'MODERATE_MEMBERS'];
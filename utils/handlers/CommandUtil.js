const { promisify } = require('util');
const { glob } = require('glob');
const Logger = require('../Logger');
const pGlob = promisify(glob);
let nbCmd = 0;
let nbFailedCmd = 0;

module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/**/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        //Checks if the command has a proper name.
        if (!cmd.name) {
            nbFailedCmd++;
            return Logger.warn(
                `Not initialised Command: NAME required but missing.\nFile : ${cmdFile}`
            );
        }
        //Checks if the command has a proper category.
        if (!cmd.category) {
            nbFailedCmd++;
            return Logger.warn(
                `Not initialised Command: CATEGORY required but missing.\nFile : ${cmdFile}`
            );
        }
        //Checks if the command has proper examples.
        if (!cmd.examples && cmd.type !== 'USER') {
            nbFailedCmd++;
            return Logger.warn(
                `Not initialised Command: EXAMPLES required but missing.\nFile : ${cmdFile}`
            );
        }
        //Checks if the command has a proper description.
        if (!cmd.description && cmd.type !== 'USER') {
            nbFailedCmd++;
            return Logger.warn(
                `Not initialised Command: DESCRIPTION required but missing.\nFile : ${cmdFile}`
            );
        }
        //Checks if the command has proper permissions.
        if (!cmd.permissions) {
            nbFailedCmd++;
            return Logger.warn(
                `Not initialised Command:\n PERMISSIONS required but missing.\nFile : ${cmdFile}`
            );
        }

        cmd.permissions.forEach(permission => {
            if (!permissionList.includes(permission)) {
                nbFailedCmd++;
                return Logger.typo(
                    `Not initialised Command: PERMISSION ${permission} unknown.\nFile : ${cmdFile}`
                );
            }
        });

        if (!cmd.usage && cmd.type !== 'USER') {
            nbFailedCmd++;
            return Logger.warn(
                `Not initialised Command:\n USAGE required but missing.\nFile : ${cmdFile}`
            );
        }
        nbCmd++;
        await client.commands.set(cmd.name, cmd);
    });
    if (nbCmd !== 0) await Logger.info(`${nbCmd} commands loaded.`);
    if (nbFailedCmd !== 0)
        await Logger.warn(`Failed to load ${nbFailedCmd} commands.`);
};

//List of all the discord API permissions.
const permissionList = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS_AND_STICKERS',
    'USE_APPLICATION_COMMANDS',
    'REQUEST_TO_SPEAK',
    'MANAGE_EVENTS',
    'MANAGE_THREADS',
    'USE_PUBLIC_THREADS',
    'CREATE_PUBLIC_THREADS',
    'USE_PRIVATE_THREADS',
    'CREATE_PRIVATE_THREADS',
    'USE_EXTERNAL_STICKERS',
    'SEND_MESSAGES_IN_THREADS',
    'START_EMBEDDED_ACTIVITIES',
    'MODERATE_MEMBERS'
];

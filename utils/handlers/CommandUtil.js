const {promisify} = require('util');
const {glob} = require('glob');
const pGlob = promisify(glob);
let nbCmd = 0;
let nbFailedCmd = 0;

module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        if(!cmd.name || (!cmd.description && cmd.type !== 'USER') ) {
            nbFailedCmd++;
            return console.log(`-----\nNot initialised Command:\n Possible reasons :\n 1. Double check the name\n 2. A description is required \n File : ${cmdFile}\n-----`)
        }

        nbCmd++;
        await client.commands.set(cmd.name, cmd);
        //console.log(`Loaded Commands : ${cmd.name}`);
    });
    if(nbCmd !== 0) await console.log(`${nbCmd} commands loaded.`);
    if(nbFailedCmd !== 0) await console.log(`Failed to load ${nbFailedCmd} commands`);
};

const {promisify} = require('util');
const {glob} = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        if(!cmd.name || (!cmd.description && cmd.type !== 'USER') ) {
            return console.log(`-----\nNot initialised Command:\n Possible reasons :\n 1. Double check the name\n 2. A description is required \n File : ${cmdFile}\n-----`)
        }

        await client.commands.set(cmd.name, cmd);
        console.log(`Loaded Commands : ${cmd.name}`);
    });
};

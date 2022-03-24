const {promisify} = require('util');
const {glob} = require('glob');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/buttons/*/*.js`)).map(async btnFile => {
        const btn = require(btnFile);
        if (!btn.name) return console.log(`-----\nNot initialised Command:  Double check the name\n File : ${btnFile}\n-----`);
        client.buttons.set(btn.name, btn);
    });

};

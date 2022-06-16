const chalk = require('chalk');
const dayjs = require('dayjs');

const format = '{tstamp} : {tag} {txt} \n';

let write = (content, tagColor, bgTagColor, tag, error = false) => {
    const timestamp = `[${dayjs().format('DD/MM - HH:mm:ss')}]`;
    const logTag = `[${tag}]`;
    const stream = error ? process.stderr : process.stdout;

    const item = format
        .replace('{tstamp}', chalk.grey(timestamp))
        .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
        .replace('{txt}', chalk.white(content));

    stream.write(item);
};

let error = content => {
    write(content, 'black', 'bgRed', 'ERROR', true);
};
let warn = content => {
    write(content, 'black', 'bgYellow', 'WARN', false);
};

let typo = content => {
    write(content, 'black', 'bgCyan', 'TYPO', false);
};

let info = content => {
    write(content, 'black', 'bgGreen', 'INFO', false);
};

let client = content => {
    write(content, 'black', 'bgBlue', 'CLIENT', false);
};

module.exports = { error, warn, typo, info, client };

const chalk = require('chalk');
const dayjs = require('dayjs');

const format = '{tstamp} : {tag} {txt} \n';

/**
 * Function formating the log.
 * @param {string} content
 * @param {string} tagColor color of the log tag.
 * @param {string} bgTagColor color of the background of the log tag.
 * @param {string} tag tag for the log.
 * @param {boolean} error boolean stating if the log is an error.
 */
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

/**
 * Returns an error string with the correct format.
 * @param {string} content Text describing the error.
 */
let error = content => {
    write(content, 'black', 'bgRed', 'ERROR', true);
};

/**
 * Returns a warning string with the correct format.
 * @param {string} content Text describing the warning.
 */
let warn = content => {
    write(content, 'black', 'bgYellow', 'WARN', false);
};

/**
 * Returns an typo error string with the correct format.
 * @param {string} content Text describing the typo.
 */
let typo = content => {
    write(content, 'black', 'bgCyan', 'TYPO', false);
};

/**
 * Returns an information string with the correct format.
 * @param {string} content Text describing the information.
 */
let info = content => {
    write(content, 'black', 'bgGreen', 'INFO', false);
};

/**
 * Returns a client related string with the correct format.
 * @param {string} content Text describing the client information.
 */
let client = content => {
    write(content, 'black', 'bgBlue', 'CLIENT', false);
};

module.exports = { error, warn, typo, info, client };

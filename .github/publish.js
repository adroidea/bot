#!/usr/bin/env node
'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawnSync;

async function version(versionType) {
    const { stdout, stderr } = await exec(`npm version ${versionType} --no-git-tag-version --force`);
    if (stderr) throw stderr;
    return stdout;
}

async function branch() {
  const { stdout, stderr } = await exec(`git rev-parse --abbrev-ref HEAD`);
  if (stderr) throw stderr;
  return stdout;
}

const run = async () => {
  try {
    const versionType = process.argv[2];
    const gitMessage = process.argv[3];

    if (versionType !== 'patch' && versionType !== 'minor' && versionType !== 'major') throw new Error('You need to specify npm version! [patch|minor|major]');
    if (!gitMessage) throw new Error('You need to provide a git commit message!');

    const npmVersion = await version(versionType);
    await spawn('git', ['add', 'package.json', 'package-lock.json'], { stdio: 'inherit' });
    await spawn('git', ['commit', '-m', gitMessage.trim()], { stdio: 'inherit' });
    await spawn('git', ['tag', npmVersion.trim()], { stdio: 'inherit' });
    await spawn('git', ['status'], { stdio: 'inherit' });
    const currentBranch = await branch();
    await spawn('git', ['push', 'origin', currentBranch.trim()], { stdio: 'inherit' });

  } catch (err) {
    console.log('Something went wrong:');
    console.error(err.message);
    console.error('\nPlease use this format: \nnpm run commit [patch|minor|major] "Commit message"');
  }
};

run();
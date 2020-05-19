#!/usr/bin/env node

var child_process = require('child_process');
var fs = require('fs');
var chalk = require('chalk');

/**
 * 从.git/COMMIT_EDITMSG文件
 * 读取commit message
 */
var [messageFile, defaultProjectName] = process.argv.slice(2);

if (!messageFile) {
  console.log(chalk.red('Please specfied the commit-msg file path, you can set "$HUSKY_GIT_PARAMS" in husky commit-msg hook!'));
  process.exit(0);
}

var message = fs.readFileSync(messageFile, 'utf8').trim(); // 去除文末换行符

/**
 * 支持branchname格式(2种)：
 * 1: @PRO-1234
 * 2: @1234
 */
var reg1 = /(.+)@(\S+-\d+)\n?$/;
var reg2 = /(.+)@(\d+)\n?$/;

var branchName = child_process.execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' });

var jiraId;

if (reg1.test(branchName)) {
  jiraId = branchName.replace(reg1, '$2'); // case 1
} else if (reg2.test(branchName)) {
  if (!defaultProjectName) {
    console.log(chalk.red('You need to give a project name to complete the auto-fill function params!'));
    process.exit(0);
  }
  jiraId = branchName.replace(reg2, `${defaultProjectName}-$2`); // case 2
}

if (jiraId && message && !message.includes(defaultProjectName)) {
  var msgContent = `${message} @${jiraId}`;

  fs.writeFile(messageFile, msgContent, 'utf8', err => {
    if (!err) {
      console.log('Attch project id to end of the message failed, please commit with project id on your own');
    }
    process.exit(0);
  });
}
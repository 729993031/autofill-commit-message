#!/usr/bin/env node

var commander = require("commander");
var child_process = require("child_process");
var fs = require("fs");
var chalk = require("chalk");

var program = new commander.Command();

program.option("--ver, --verify", "verify the existence of taskid");

program.parse(process.argv);

/**
 * 从.git/COMMIT_EDITMSG文件
 * 读取commit message
 */
var [messageFile, defaultProjectName] = program.args;
/**
 * 强制commit message能够携带task id
 */
var needVerify = program.verify;

if (!messageFile) {
  console.log(
    chalk.red(
      'Please specfied the commit-msg file path, you can set "$HUSKY_GIT_PARAMS" in husky commit-msg hook!'
    )
  );
  process.exit(0);
}

var message = fs.readFileSync(messageFile, "utf8").trim(); // 去除文末换行符

/**
 * 支持branchname格式(2种)：
 * 1: @PRO-1234
 * 2: @1234
 */
var reg1 = /(.+)@(\S+-\d+)\n?$/;
var reg2 = /(.+)@(\d+)\n?$/;

var branchName = child_process.execSync("git rev-parse --abbrev-ref HEAD", {
  encoding: "utf8",
});

var jiraId;

if (reg1.test(branchName)) {
  jiraId = branchName.replace(reg1, "$2"); // case 1
} else if (reg2.test(branchName)) {
  if (!defaultProjectName) {
    console.log(
      chalk.red(
        "You need to give a project name to complete the auto-fill function params!"
      )
    );
    process.exit(0);
  }
  jiraId = branchName.replace(reg2, `${defaultProjectName}-$2`); // case 2
}

// 开启了强制校验
if (needVerify) {
  /**
   * 告警条件：
   * 1. branchname 未携带 task id
   * 2. commit message 未携带 task id
   */
  if (!jiraId && !reg1.test(message) && !reg2.test(message)) {
    console.log(
      chalk.red("commit message必须携带task id,请确认commit message符合规则!")
    );
    process.exit(1);
  }
}

if (jiraId && message && !message.includes(defaultProjectName)) {
  var msgContent = `${message} @${jiraId}`;

  fs.writeFile(messageFile, msgContent, "utf8", (err) => {
    if (err) {
      console.log(
        "Attch project id to end of the message failed, please commit with project id on your own"
      );
    }
    process.exit(0);
  });
}

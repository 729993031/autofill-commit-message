# autofill-commit-message

Autofill commit message with keywords from branchname which matches the fixed format like @***.

[中文文档](https://github.com/Zwe1/autofill-commit-message/blob/master/README.zh-CN.md)

[English Document](https://github.com/Zwe1/autofill-commit-message)

### Install

```
npm i autofill-commit-message -D 
```

### Where to use

You can put the jiraId on your branchname with asked format, then it will be automatically recognized and fill at end of your commit message for free what saves a lot of time for committing.

### Usage

This plugin based on git hook commit-msg, and we recommend you use it with [husky]('https://github.com/typicode/husky').

#### 1. Install husky (skip when installed)

npm i -D husky 

#### 2.  Husky config

Autofill-commit-message meets two parameters。One works for finding commit-msg file, please pass **$HUSKY_GIT_PARAMS** when use husky; the other works for completing project which is not necessary when your branchname looks like **feature@PROJECT-1234**.

<img src="./assets/husky.png">


#### 3. Branchname

Branchname should obey the rules like below;

git checkout -b feature@Pro-1234 或 git checkout -b feature@1234

#### 4. Develop and commit

git commit -m 'fix: hotfix'

### Result

<img src="./assets/commit.png">
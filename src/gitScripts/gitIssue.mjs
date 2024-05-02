import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import inquirer from 'inquirer';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import { SingleBar } from 'cli-progress';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const issueTemplatePath = path.join(__dirname, '..', '.github', 'ISSUE_TEMPLATE');

//PREREQUISITE
const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;

const REMOTE_REPO_OWNER = 'reable-dev';
const REPO_NAME = 'ems-admin';
const GIT_API_URL = `https://api.github.com/repos/${REMOTE_REPO_OWNER}/${REPO_NAME}/issues`;
const TITLE_PLACEHOLDER = '${{issue title placeholder}}';

const ISSUE_TYPE_MAP = {
  feature: {
    filename: '💡-feature-issue-template.md',
  },
  fix: {
    filename: '🔨-fix-issue-template.md',
  },
  bug: {
    filename: '⚠️-bug-issue-template.md',
  },
  test: {
    filename: '🔬-test-issue-template.md',
  },
};

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */
    //1. check required variables
    const isExistRequiredVars = checkIsRequiredVariablesExist();
    if (!isExistRequiredVars.status) {
      return console.log(
        `🕹 please set the required variables on the ".env"\n ${isExistRequiredVars.emptyVariablekeys
          .map((e, i) => `${i + 1}. ${e}`)
          .join('\n')}`,
      );
    }

    //2. check git CLI
    const isGithubCLIExist = await checkGithubCLI();

    if (!isGithubCLIExist) {
      await installGithubCLI();
    }

    //3. check git CLI login status
    const isGithubCLILoggedin = await checkGithubAuth();
    if (!isGithubCLILoggedin) {
      return console.log('🔐 Please auth login first to use gh.\nRun : \x1b[36mgh auth login\x1b[0m');
    }

    //4. checkout to feature branch from local muchine
    await checkoutTofeatureBranch();

    //4-1. check origin branch remote alias
    const upstreamRemoteAlias = await findRemoteAlias(`${REMOTE_REPO_OWNER}/${REPO_NAME}`);
    if (!upstreamRemoteAlias) {
      return console.log(
        '🕹 No remote for "upstream" branch. please add it first\nRun : \x1b[36mgit remote add upstream {upstream repository url}\x1b[0m',
      );
    }

    //5. sync fork branch with remote original branch and update local branch
    await syncForkBranchAndPullLocalBranch(upstreamRemoteAlias);

    /**
     * @ISSUE_CREATION
     */
    // 1. inquiry
    const issueType = await inquireIssueType();
    const issueTitle = await inquirerIssueTitle();

    // 2. select proper template
    const issueTemplate = getIssueTemplate(path.join(issueTemplatePath, ISSUE_TYPE_MAP[issueType].filename));

    // 3. replace title placeholder
    const titleReplacedTemplate = replaceTitlePlaceholder({ issueTemplate, issueTitle });

    // 4. create issue and receive issue number
    const createIssueResult = await createGitHubIssue({
      issueTemplate: titleReplacedTemplate,
      issueTitle,
    });

    if (createIssueResult) {
      // 5. checkout
      const { issueNumber, issueURL } = createIssueResult;

      exec(`git checkout -b issue-${issueNumber}`);
      console.log(`✨ your issue is created : ${issueURL}`);
    }
  } catch (err) {
    console.error(`unhanlded error : ${err}`);
  }
})();

/**
 *
 * @helpers
 */

function checkIsRequiredVariablesExist() {
  const requiredVariables = { GIT_ACCESS_TOKEN, FORK_REPO_OWNER };

  return Object.entries(requiredVariables).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc.status = false;
        acc.emptyVariablekeys.push(key);
      }
      return acc;
    },
    { status: true, emptyVariablekeys: [] },
  );
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(error || stderr);
        reject(null);
      }

      resolve(stdout);
    });
  });
}

function checkBranchExistence(branchName) {
  return new Promise((resolve, reject) => {
    exec(`git show-ref --verify --quiet refs/heads/${branchName}`, (error) => {
      if (error && error.code === 1) {
        resolve(false);
      } else if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

async function checkoutTofeatureBranch() {
  const currentBranch = await executeCommand('git branch --show-current');
  const isExistFeatureBranch = await checkBranchExistence('feature');

  if (!isExistFeatureBranch) {
    await executeCommand('git checkout -b feature');
  }

  if (currentBranch !== 'feature') {
    await executeCommand('git checkout feature');
  }
}

async function checkGithubCLI() {
  return executeCommand('gh --version');
}
async function installGithubCLI() {
  return new Promise((resolve, reject) => {
    console.log('No gh installed, please wait for installation');

    const progressBar = new SingleBar({
      format: '{bar} {percentage}% | ETA: {eta}s | {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    });

    progressBar.start(100, 0);
    let progressStep = 0;

    const brewInstallProcess = exec('brew install gh');

    brewInstallProcess.stdout.on('data', () => {
      progressStep += 1;
      progressBar.update(progressStep * 20);
    });

    brewInstallProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('\nSuccess to install gh');
        resolve(true);
      } else {
        console.error('Failed to install gh. Please check brew');
        reject(null);
      }
      progressBar.stop();
    });
  });
}

async function checkGithubAuth() {
  return executeCommand('gh auth status');
}

async function findRemoteAlias(targetString) {
  const remoteAlias = await executeCommand(`git remote -v | grep '${targetString}' | awk '{print $1}'`);

  return remoteAlias.split(/\n/)[0];
}
async function syncForkBranchAndPullLocalBranch(originAlias) {
  await executeCommand(`gh repo sync ${FORK_REPO_OWNER}/${REPO_NAME} -b feature`);
  await executeCommand(`git pull ${originAlias} feature`);
}

async function inquireIssueType() {
  const { issueType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'issueType',
      message: 'what type of issue you want to create',
      choices: Object.keys(ISSUE_TYPE_MAP),
    },
  ]);

  return issueType;
}

async function inquirerIssueTitle() {
  const { title } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter issue title:',
      validate: (input) => {
        if (!input) {
          return 'You have to input issue title';
        }
        return true;
      },
    },
  ]);

  return title;
}

function getIssueTemplate(url) {
  try {
    const templateContent = fs.readFileSync(url, 'utf8');
    return templateContent;
  } catch (error) {
    console.error('Error reading issue template file:', error);
    return null;
  }
}

function replaceTitlePlaceholder({ issueTemplate, issueTitle }) {
  if (!issueTemplate) return null;
  return String(issueTemplate).replace(TITLE_PLACEHOLDER, issueTitle);
}

function unescapeUnicode(str) {
  const unicodeRegex = /\\[uU]([0-9a-fA-F]{4,8})/g;
  const matched = str.match(unicodeRegex);

  if (!matched) return str;

  return str.replace(unicodeRegex, (_, group) => String.fromCodePoint(parseInt(group, 16)));
}
async function createGitHubIssue({ issueTemplate, issueTitle }) {
  // default body
  let requestBody = { title: issueTitle };

  if (issueTemplate) {
    // separate markdown
    const hypenSplittedGroup = String(issueTemplate)
      .split('---')
      .map((section) => section.trim());

    // extract metadata
    const templateMeatadata = hypenSplittedGroup[1].split('\n').reduce((acc, cur) => {
      const [key, value] = cur.split(/:(.+)/, 2);

      if (key === 'assignees') return acc; // assignees is a property that shuold be empty for this case

      const arrayValueKey = ['labels']; // a key list that requires array value

      acc[key] = arrayValueKey.includes(key)
        ? value.split(',').map((e) => e.trim())
        : unescapeUnicode(value.trim().replace(/^"|"$/g, '')); // change emoji unicode to true emoji if included

      return acc;
    }, {});

    const templateBody = hypenSplittedGroup[2] ?? '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // update requestBody
    requestBody = { ...templateMeatadata, body: templateBody };
  }

  try {
    const response = await fetch(GIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status !== 201) {
      console.log('failed to receive success response, please check your env');
      return false;
    } else {
      const data = await response.json();

      return {
        issueNumber: data.number,
        issueURL: data.html_url,
      };
    }
  } catch (err) {
    console.error(err);
    throw new Error('failed to create issue, check your env again');
  }
}

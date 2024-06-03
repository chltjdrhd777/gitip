import select from '@inquirer/select';
const { prompt } = require('enquirer');

import {
  checkIsRequiredVariablesExist,
  checkGithubCLI,
  installGithubCLI,
  checkGithubAuth,
  checkoutToTargetBranch,
  findRemoteAlias,
  syncForkBranchAndPullLocalBranch,
  loadEnv,
} from '@/utils';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { cwd } from 'process';
import { exec } from 'child_process';

/**@PRE_REQUISITE */
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const REMOTE_REPO_OWNER = process.env.REMOTE_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME;
const TEMPLATE_TITLE_PLACEHOLDER = process.env.TEMPLATE_TITLE_PLACEHOLDER;
const GIT_API_URL = `https://api.github.com/repos/${REMOTE_REPO_OWNER}/${REPO_NAME}/issues`;

const ISSUE_TEMPLATE_PATH = path.join(cwd(), '.github', 'ISSUE_TEMPLATE');

const DEFAULT_ISSUE_TEMPLATES: { name: string; value: string }[] = [
  { name: 'feature', value: 'feature' },
  { name: 'fix', value: 'fix' },
  { name: 'bug', value: 'bug' },
  { name: 'test', value: 'test' },
];

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */

    //1. check required variables
    const isExistRequiredVars = checkIsRequiredVariablesExist({
      GIT_ACCESS_TOKEN,
      REMOTE_REPO_OWNER,
      FORK_REPO_OWNER,
      REPO_NAME,
      BRANCH_NAME,
    });
    if (!isExistRequiredVars.status) {
      return console.error(
        `🕹 please set the required variables on the ".env"\n${isExistRequiredVars.emptyVariablekeys
          .map((e, i) => `${i + 1}. ${e}`)
          .join('\n')}\n\n🕹  If variables already exist, please run this command from the root folder of your project`,
      );
    }

    //2. check git CLI
    const isGithubCLIExist = checkGithubCLI();
    if (!isGithubCLIExist) {
      await installGithubCLI();
    }

    //3. check git CLI login status
    const isGithubCLILoggedin = checkGithubAuth();
    if (!isGithubCLILoggedin) {
      return console.error('🔐 Please auth login first to use gh.\nRun : \x1b[36mgh auth login\x1b[0m');
    }

    //4. checkout to feature branch from local muchine
    await checkoutToTargetBranch(BRANCH_NAME ?? '');

    //4-1. check origin branch remote alias
    const upstreamRemoteAlias = await findRemoteAlias(`${REMOTE_REPO_OWNER}/${REPO_NAME}`);
    if (!upstreamRemoteAlias) {
      return console.error(
        '🕹 No remote for "upstream" branch. please add it first\nRun : \x1b[36mgit remote add upstream {upstream repository url}\x1b[0m',
      );
    }

    //5. sync fork branch with remote original branch and update local branch
    syncForkBranchAndPullLocalBranch({
      FORK_REPO_OWNER,
      REPO_NAME,
      BRANCH_NAME,
      upstreamRemoteAlias,
    });

    /**
     * @ISSUE_CREATION
     */

    // 1. inquiry
    const issueTypeTemplateFilename = await inquireIssueType();
    const issueTitle = await inquirerIssueTitle();

    // 2. select proper template
    const issueTemplate = getIssueTemplate(path.join(ISSUE_TEMPLATE_PATH, issueTypeTemplateFilename));

    // 3. replace title placeholder
    const titleReplacedTemplate = replaceTitlePlaceholder(issueTemplate, issueTitle);

    // 4. create issue and receive issue number
    const createIssueResult = await createGitHubIssue(titleReplacedTemplate, issueTitle);

    if (createIssueResult) {
      // 5. checkout
      const { issueNumber, issueURL } = createIssueResult;

      exec(`git checkout -b issue-${issueNumber}`);
      console.log(`✨ your issue is created : ${issueURL}`);
    }
  } catch (err) {
    console.log('failed to create github issue', err);
  }
})();

/**
 * @helper
 */
function readTemplateDirectory() {
  try {
    const templateFolderPath = './.github/ISSUE_TEMPLATE';
    const templates = readdirSync(path.join(process.cwd(), templateFolderPath));

    return templates.map((templateFileName) => ({
      nmae: templateFileName,
      value: templateFileName,
    }));
  } catch {
    return null;
  }
}

async function inquireIssueType() {
  let choices = [];

  const templates = readTemplateDirectory();

  if (templates === null || templates.length === 0) {
    choices = DEFAULT_ISSUE_TEMPLATES;
  } else {
    choices = templates;
  }

  const answer = await select({
    message: 'what type of issue you want to create:',
    choices,
  });

  return answer;
}

async function inquirerIssueTitle() {
  const response = await prompt({
    type: 'input',
    name: 'title',
    message: 'Enter issue title:',
    validate(value: string) {
      if (!value) {
        return 'please enter the title';
      }
      return true;
    },
  });

  return response.title;
}

function getIssueTemplate(url: string) {
  try {
    const templateContent = readFileSync(url, 'utf8');
    return templateContent;
  } catch (error) {
    return null;
  }
}

function replaceTitlePlaceholder(issueTemplate: string | null, issueTitle: string) {
  if (!issueTemplate) return null;

  if (TEMPLATE_TITLE_PLACEHOLDER) {
    issueTemplate = issueTemplate.replace(TEMPLATE_TITLE_PLACEHOLDER, issueTitle);
  }
  return issueTemplate;
}

function unescapeUnicode(str: string) {
  const unicodeRegex = /\\[uU]([0-9a-fA-F]{4,8})/g;
  const matched = str.match(unicodeRegex);

  if (!matched) return str;

  return str.replace(unicodeRegex, (_, group) => String.fromCodePoint(parseInt(group, 16)));
}
async function createGitHubIssue(issueTemplate: string | null, issueTitle: string) {
  // default body
  let requestBody: { [key: string]: string } = { title: issueTitle };

  if (issueTemplate) {
    // separate markdown
    const hypenSplittedGroup = String(issueTemplate)
      .split('---')
      .map((section) => section.trim());

    // extract metadata
    const templateMeatadata = hypenSplittedGroup[1].split('\n').reduce((acc, cur) => {
      const [key, value] = cur.split(/:(.+)/, 2);

      if (key === 'assignees') {
        acc[key] = [FORK_REPO_OWNER];
        return acc;
      }

      const arrayValueKey = ['labels']; // a key list that requires array value

      acc[key] = arrayValueKey.includes(key)
        ? value.split(',').map((e) => e.trim())
        : unescapeUnicode(value.trim().replace(/^"|"$/g, '')); // change emoji unicode to hexadecimal

      return acc;
    }, {} as { [key: string]: any });

    const templateBody = hypenSplittedGroup[2] ?? '';

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

    if (response.status === 422) {
      return console.log(`🚫 status code : 422. This can happen for the following reasons\n
			1. No issue branch was created for pull request(or closed by cib cli). check your fork repository first\n
			2. your request properties are not valid. check environment variables. (ex. FORK_REPO_OWNER )\n
			3. No change was detected. make change and commit first
			`);
    }

    if (response.status !== 201) {
      console.log('failed to receive success response, please check your env', response);
      return false;
    } else {
      const data = (await response.json()) as any;

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

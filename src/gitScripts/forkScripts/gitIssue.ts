import {
  checkIsRequiredVariablesExist,
  checkoutToTargetBranch,
  findRemoteAlias,
  loadEnv,
  syncForkBranchAndUpdateLocal,
  inquireIssueType,
  inquireIssueTitle,
  getIssueTemplate,
  replaceTitlePlaceholder,
  inquireIssueBranchName,
  sleep,
  createIssueBranchName,
  createFindRemoteAliasErrorMessage,
  createCheckIsRequiredVariablesExistErrorMessage,
  createCheckoutToTargetBranchErrorMessage,
} from '@/utils';

import path from 'path';
import { cwd } from 'process';
import { exec } from 'child_process';
import { COLORS } from '@/constants/colors';

const ora = require('ora-classic');

/**@PRE_REQUISITE */
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const UPSTREAM_REPO_OWNER = process.env.UPSTREAM_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME;
const TEMPLATE_TITLE_PLACEHOLDER = process.env.TEMPLATE_TITLE_PLACEHOLDER;
const GIT_API_URL = `https://api.github.com/repos/${UPSTREAM_REPO_OWNER}/${REPO_NAME}/issues`;
const ISSUE_TEMPLATE_PATH = path.join(cwd(), '.github', 'ISSUE_TEMPLATE');

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */

    //1. check required variables
    checkIsRequiredVariablesExist(
      {
        GIT_ACCESS_TOKEN,
        UPSTREAM_REPO_OWNER,
        FORK_REPO_OWNER,
        REPO_NAME,
        BRANCH_NAME,
      },
      {
        onError: (variables) => console.error(createCheckIsRequiredVariablesExistErrorMessage({ variables })),
      },
    );

    //4. checkout to feature branch on local machine
    await checkoutToTargetBranch(BRANCH_NAME as string, {
      onError: () => console.error(createCheckoutToTargetBranchErrorMessage({ BRANCH_NAME })),
    });

    //4-1. check upstream repository remote alias
    findRemoteAlias(`${UPSTREAM_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'upstream' })),
    });

    //5. sync fork branch with remote original branch and update local branch
    const spinner = ora(`🕹 syncing fork branch with upstream...`).start();
    await sleep(500);

    syncForkBranchAndUpdateLocal({
      UPSTREAM_REPO_OWNER,
      FORK_REPO_OWNER,
      REPO_NAME,
      syncTargetBranch: BRANCH_NAME,
      config: {
        debug: false,
        onSuccess: () => {
          spinner.stop();
        },
      },
    });

    /**
     * @ISSUE_CREATION
     */

    // 1. inquiry
    const issueTypeTemplateFilename = await inquireIssueType();
    const issueTitle = await inquireIssueTitle();
    const issueBranchName = await inquireIssueBranchName();

    // 2. select proper template
    const issueTemplate = getIssueTemplate(path.join(ISSUE_TEMPLATE_PATH, issueTypeTemplateFilename));

    // 3. replace title placeholder
    const titleReplacedTemplate = replaceTitlePlaceholder(issueTemplate, issueTitle, TEMPLATE_TITLE_PLACEHOLDER);

    // 4. create issue and receive issue number
    const createIssueResult = await createGitHubIssue(titleReplacedTemplate, issueTitle);

    if (createIssueResult) {
      // 5. checkout
      const { issueNumber } = createIssueResult;

      exec(`git checkout -b ${createIssueBranchName({ issueBranchName, issueNumber })}`);
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'test') {
      console.log('\n🚫 Failed to create github issue', err);
    }
  }
})();

/**
 * @helper
 */

function unescapeUnicode(str: string) {
  const unicodeRegex = /\\[uU]([0-9a-fA-F]{4,8})/g;
  const matched = str.match(unicodeRegex);

  if (!matched) return str;

  return str.replace(unicodeRegex, (_, group) => String.fromCodePoint(parseInt(group, 16)));
}
async function createGitHubIssue(issueTemplate: string | null, issueTitle: string) {
  // default body
  let requestBody: { [key: string]: string } = { title: issueTitle };

  if (issueTemplate && TEMPLATE_TITLE_PLACEHOLDER) {
    // separate markdown
    const hyphenSplittedGroup = String(issueTemplate)
      .split('---')
      .map((section) => section.trim());

    // extract metadata
    const templateMetadata = hyphenSplittedGroup[1].split('\n').reduce((acc, cur) => {
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

    const templateBody = hyphenSplittedGroup[2] ?? '';

    // update requestBody
    requestBody = { ...templateMetadata, body: templateBody };
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
      return console.log(`\n🚫 status code : 422. This can happen for the following reasons\n
			1. No issue branch was created for pull request(or closed by cib cli). check your fork repository first\n
			2. your request properties are not valid. check environment variables. (ex. FORK_REPO_OWNER )\n
			3. No change was detected. make change and commit first
			`);
    }

    if (response.status !== 201) {
      console.log('\n🚫 Failed to receive success response, please check your env', response);
      return false;
    } else {
      const data = (await response.json()) as any;

      const { bold, reset, cyan, green, yellow, magenta } = COLORS;

      const baseBranch = magenta + (data.base || 'develop') + reset;
      const headBranch = yellow + (data.head || 'feature/my-feature') + reset;

      console.log(`
${green}${bold}✨ Issue Created Successfully!${reset}
🏷️  ${bold}Issue Number:${reset}  ${yellow}${data.number}${reset}
🔗  ${bold}URL:${reset}           ${cyan}${data.html_url}${reset}
📄  ${bold}Title:${reset}         ${yellow}${issueTitle}${reset}
🌿  ${bold}Base Branch:${reset}   ${baseBranch}
🌱  ${bold}Head Branch:${reset}   ${headBranch}
`);

      return {
        issueNumber: data.number,
        issueURL: data.html_url,
      };
    }
  } catch (err) {
    console.error(err);
    throw new Error('\n🚫 Failed to create issue, check your env again');
  }
}

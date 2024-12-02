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
} from '@/utils';

import path from 'path';
import { cwd } from 'process';
import { exec } from 'child_process';

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
        onError: (variables) => {
          console.error(
            `🕹 please set the required variables on the ".env.{environment}"\n${(variables?.emptyVariableKeys ?? [])
              .map((e, i) => `${i + 1}. ${e}`)
              .join(
                '\n',
              )}\n\n🕹  If variables already exist, please run this command from the root folder of your project`,
          );
        },
      },
    );

    //4. checkout to feature branch from local machine
    await checkoutToTargetBranch(BRANCH_NAME as string, {
      onError: () => {
        console.error(`❌ failed to checkout ${BRANCH_NAME}`);
      },
    });

    //4-1. check origin branch remote alias
    findRemoteAlias(`${UPSTREAM_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => {
        return console.error(
          '🕹 No remote for "upstream" branch. please add it first\nRun : \x1b[36mgit remote add upstream {upstream repository url}\x1b[0m',
        );
      },
    });

    //5. sync fork branch with remote original branch and update local branch
    syncForkBranchAndUpdateLocal({
      UPSTREAM_REPO_OWNER,
      FORK_REPO_OWNER,
      REPO_NAME,
      syncTargetBranch: BRANCH_NAME,
      config: {
        debug: false,
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
    const titleReplacedTemplate = replaceTitlePlaceholder(issueTemplate, issueTitle);

    // 4. create issue and receive issue number
    const createIssueResult = await createGitHubIssue(titleReplacedTemplate, issueTitle);

    if (createIssueResult) {
      // 5. checkout
      const { issueNumber, issueURL } = createIssueResult;

      exec(`git checkout -b ${issueBranchName}-${issueNumber}`);
      console.log(`✨ your issue is created : ${issueURL}`);
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'test') {
      console.log('failed to create github issue', err);
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
    const hypenSplittedGroup = String(issueTemplate)
      .split('---')
      .map((section) => section.trim());

    // extract metadata
    const templateMetadata = hypenSplittedGroup[1].split('\n').reduce((acc, cur) => {
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

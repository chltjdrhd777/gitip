import {
  checkRequiredVariablesExist,
  inquireIssueType,
  inquireIssueTitle,
  getIssueTemplate,
  replaceTitlePlaceholder,
  inquireIssueBranchName,
  sleep,
  createIssueBranchName,
  createCheckRequiredVariablesExistErrorMessage,
} from '@/utils';

import path from 'path';
import { cwd } from 'process';
import { exec } from 'child_process';
import {
  createGitHubIssue,
  checkoutToTargetBranch,
  createCheckoutToTargetBranchErrorMessage,
  findRemoteAlias,
  createFindRemoteAliasErrorMessage,
  syncForkBranchAndUpdateLocal,
} from '@/service';

const ora = require('ora-classic');

/**@PRE_REQUISITE */
const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const UPSTREAM_REPO_OWNER = process.env.UPSTREAM_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const DEFAULT_BRANCH_NAME = process.env.DEFAULT_BRANCH_NAME;
const TEMPLATE_TITLE_PLACEHOLDER = process.env.TEMPLATE_TITLE_PLACEHOLDER;
const GIT_API_URL = `https://api.github.com/repos/${UPSTREAM_REPO_OWNER}/${REPO_NAME}/issues`;
const ISSUE_TEMPLATE_PATH = path.join(cwd(), '.github', 'ISSUE_TEMPLATE');

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */

    //1. check required variables
    checkRequiredVariablesExist(
      {
        GIT_ACCESS_TOKEN,
        UPSTREAM_REPO_OWNER,
        FORK_REPO_OWNER,
        REPO_NAME,
        DEFAULT_BRANCH_NAME,
      },
      {
        onError: (variables) => console.error(createCheckRequiredVariablesExistErrorMessage({ variables })),
      },
    );

    //2. checkout to feature branch on local machine
    await checkoutToTargetBranch(DEFAULT_BRANCH_NAME as string, {
      onError: () => console.error(createCheckoutToTargetBranchErrorMessage({ branchName: DEFAULT_BRANCH_NAME })),
    });

    //3. check upstream repository remote alias
    findRemoteAlias(`${UPSTREAM_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'upstream' })),
    });

    //4. sync fork branch with remote original branch and update local branch
    const spinner = ora(`🕹 syncing fork branch with upstream...`).start();
    await sleep(500);

    syncForkBranchAndUpdateLocal({
      UPSTREAM_REPO_OWNER,
      FORK_REPO_OWNER,
      REPO_NAME,
      syncTargetBranch: DEFAULT_BRANCH_NAME,
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
    const createIssueResult = await createGitHubIssue({
      issueTemplate: titleReplacedTemplate,
      issueTitle,
      TEMPLATE_TITLE_PLACEHOLDER,
      TARGET_REPO_OWNER: FORK_REPO_OWNER,
      GIT_API_URL,
      GIT_ACCESS_TOKEN,
    });

    if (createIssueResult) {
      const { issueNumber } = createIssueResult;
      exec(`git checkout -b ${createIssueBranchName({ issueBranchName, issueNumber })}`);
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'test') {
      console.log('\n🚫 Failed to create github issue', err);
    }
  }
})();

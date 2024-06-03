import { checkIsRequiredVariablesExist, getCurrentBranchName } from '@/utils';
import { exec, execSync } from 'child_process';

import dotenv from 'dotenv';
dotenv.config();

//PREREQUISITE
const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const REMOTE_REPO_OWNER = process.env.REMOTE_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME;
const TEMPLATE_TITLE_PLACEHOLDER = process.env.TEMPLATE_TITLE_PLACEHOLDER;

const GIT_API_URL = `https://api.github.com/repos/${REMOTE_REPO_OWNER}/${REPO_NAME}/pulls`;

(async () => {
  /**
   * @PRE_SETTINGS
   */

  //0. check variables required first
  const isExistRequiredVars = checkIsRequiredVariablesExist({
    GIT_ACCESS_TOKEN,
    REMOTE_REPO_OWNER,
    FORK_REPO_OWNER,
    REPO_NAME,
    BRANCH_NAME,
    TEMPLATE_TITLE_PLACEHOLDER,
  });
  if (!isExistRequiredVars.status) {
    return console.log(
      `🕹 please set the required variables on the ".env"\n ${isExistRequiredVars.emptyVariablekeys
        .map((e, i) => `${i + 1}. ${e}`)
        .join('\n')}`,
    );
  }

  //1. get current branch name
  const currentBranchName = getCurrentBranchName();

  console.log('이거 동작하니?', currentBranchName);

  return;
})();

import {
  checkGithubCLI,
  checkIsRequiredVariablesExist,
  findRemoteAlias,
  getBranchList,
  loadEnv,
  syncForkBranchAndPullLocalBranch,
} from '@/utils';

import select from '@inquirer/select';

//PREREQUISITE
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const REMOTE_REPO_OWNER = process.env.REMOTE_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

(async () => {
  const isExistRequiredVars = checkIsRequiredVariablesExist({
    GIT_ACCESS_TOKEN,
    REMOTE_REPO_OWNER,
    FORK_REPO_OWNER,
    REPO_NAME,
  });
  if (!isExistRequiredVars.status) {
    return console.log(
      `🕹 please set the required variables on the ".env.{environment}"\n ${isExistRequiredVars.emptyVariablekeys
        .map((e, i) => `${i + 1}. ${e}`)
        .join('\n')}`,
    );
  }

  const isGithubCLIExist = checkGithubCLI();
  if (!isGithubCLIExist) {
    return console.error(
      '🕹 you have no github CLI... please install and login first : \n1. brew install gh\n2. gh auth login',
    );
  }

  const targetBranch = await askTargetBranchToSync();

  const upstreamRemoteAlias = await findRemoteAlias(`${REMOTE_REPO_OWNER}/${REPO_NAME}`);
  syncForkBranchAndPullLocalBranch({
    FORK_REPO_OWNER,
    REPO_NAME,
    BRANCH_NAME: targetBranch,
    upstreamRemoteAlias,
  });

  console.log('✅ done');
})();

/**
 * @helpers
 */

async function askTargetBranchToSync() {
  const branchList = getBranchList();
  const refined = branchList
    .trim()
    .split('\n')
    .map((branch) => {
      const data = branch.replace(/\*/, '').trim();
      return { key: data, value: data };
    });

  const branchName = await select({
    message: 'what fork branch do you want to sync',
    choices: refined,
  });

  return branchName;
}

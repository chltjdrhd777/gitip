const ora = require('ora-classic');

import { checkIsRequiredVariablesExist, getBranchList, loadEnv, sleep, syncForkBranchAndUpdateLocal } from '@/utils';

import select from '@inquirer/select';

//PREREQUISITE
loadEnv();

const UPSTREAM_REPO_OWNER = process.env.UPSTREAM_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

(async () => {
  const isExistRequiredVars = checkIsRequiredVariablesExist({
    UPSTREAM_REPO_OWNER,
    FORK_REPO_OWNER,
    REPO_NAME,
  });
  if (!isExistRequiredVars.status) {
    return console.log(
      `🕹 please set the required variables on the ".env.{environment}"\n ${isExistRequiredVars.emptyVariableKeys
        .map((e, i) => `${i + 1}. ${e}`)
        .join('\n')}`,
    );
  }

  const targetBranch = await askTargetBranchToSync();

  const spinner = ora('please wait for cleaning').start();
  await sleep(1000);

  syncForkBranchAndUpdateLocal({
    UPSTREAM_REPO_OWNER,
    FORK_REPO_OWNER,
    REPO_NAME,
    syncTargetBranch: targetBranch,
    config: {
      onSuccess: () => console.log('✅ done'),
    },
  });

  spinner.stop();
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

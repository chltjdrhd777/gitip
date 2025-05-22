const ora = require('ora-classic');

import { MESSAGE } from '@/constants/message';
import { getBranchList, syncForkBranchAndUpdateLocal } from '@/service';
import { syncLocalBranchWithOrigin } from '@/service/github-service/syncLocalBranchWithOrigin';
import { cancel, checkRequiredVariablesExist, sleep } from '@/utils';

import select from '@inquirer/select';

/**@PRE_REQUISITE */
const ORIGIN_REPO_OWNER = process.env.ORIGIN_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

(async () => {
  try {
    const isExistRequiredVars = checkRequiredVariablesExist({
      ORIGIN_REPO_OWNER,
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

    const spinner = ora('please wait for cleaning...').start();
    await sleep(1000);

    syncLocalBranchWithOrigin({
      ORIGIN_REPO_OWNER,
      REPO_NAME,
      syncTargetBranch: targetBranch,
    });

    spinner.stop();
  } catch (error: any) {
    cancel(error);

    console.error('🚫 Unexpected error:', error);
  }
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

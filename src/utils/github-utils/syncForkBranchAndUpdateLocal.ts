import { Callbacks } from '@/types';
import { executeCommand } from '../common-utils/executeCommand'; // Adjust the import path as needed
import { findRemoteAlias } from './findRemoteAlias';
import { log } from '../common-utils';

interface SyncForkBranchParams {
  UPSTREAM_REPO_OWNER?: string;
  FORK_REPO_OWNER?: string;
  REPO_NAME?: string;
  syncTargetBranch?: string;
  config?: {
    debug?: boolean;
  } & Callbacks;
}

export async function syncForkBranchAndUpdateLocal({
  UPSTREAM_REPO_OWNER,
  FORK_REPO_OWNER,
  REPO_NAME,
  syncTargetBranch,
  config = {},
}: SyncForkBranchParams) {
  const { debug } = config;

  try {
    const forkRepoRemoteAlias = await findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`);
    if (!forkRepoRemoteAlias) {
      console.error(
        `❌ Failed to find remote alias for the fork repository: ${UPSTREAM_REPO_OWNER}/${REPO_NAME}. Please add it first.\n` +
          `👉 To add the fork repository remote, run the following command:\n` +
          `\n` +
          `   💻 git remote add "fork_repo_remote_alias" "fork_repo_url"\n` +
          `\n` +
          `🔗 This will allow you to fetch updates from the upstream repository.\n`,
      );
    }

    const upstreamRepoRemoteAlias = await findRemoteAlias(`${UPSTREAM_REPO_OWNER}/${REPO_NAME}`);
    if (!upstreamRepoRemoteAlias) {
      console.error(
        `❌ Failed to find remote alias for the upstream repository: ${UPSTREAM_REPO_OWNER}/${REPO_NAME}. Please add it first.\n` +
          `👉 To add the upstream repository remote, run the following command:\n` +
          `\n` +
          `   💻 git remote add "upstream_repo_remote_alias" "upstream_repo_url"\n` +
          `\n` +
          `🔗 This will allow you to fetch updates from the upstream repository.\n`,
      );
      return;
    }

    // Fetch updates from the upstream repository
    executeCommand(`git fetch ${upstreamRepoRemoteAlias}`, { debug });
    log(debug, () => console.log(`✅ Fetched upstream(${upstreamRepoRemoteAlias}) changes.`));

    // Switch to the target branch
    const checkoutResult = executeCommand(`git checkout ${syncTargetBranch}`, { debug });
    if (!checkoutResult) {
      console.error(`❌ Failed to checkout branch: ${syncTargetBranch}. check your local branch list first.`);
      return;
    }
    log(debug, () => console.log(`✅ Checked out branch: ${syncTargetBranch}.`));

    // Pull updates from the upstream branch
    executeCommand(`git pull ${upstreamRepoRemoteAlias} ${syncTargetBranch}`, { debug });
    log(debug, () => console.log(`✅ Pulled updates from ${upstreamRepoRemoteAlias}/${syncTargetBranch}.`));

    // Push updates to the forked repository
    executeCommand(`git push ${forkRepoRemoteAlias} ${syncTargetBranch}`, { debug });
    log(debug, () => console.log(`✅ Pushed updates to ${forkRepoRemoteAlias}/${syncTargetBranch}.`));

    //callback
    config?.onSuccess?.();
  } catch (error) {
    console.error(`❌ Error during sync: ${error}`);
  }
}

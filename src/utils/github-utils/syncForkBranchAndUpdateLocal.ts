import { Callbacks, DefaultConfig } from '@/types';
import { executeCommand } from '../common-utils/executeCommand'; // Adjust the import path as needed
import { findRemoteAlias } from './findRemoteAlias';
import { log } from '../common-utils';

interface SyncForkBranchParams {
  UPSTREAM_REPO_OWNER?: string;
  FORK_REPO_OWNER?: string;
  REPO_NAME?: string;
  syncTargetBranch?: string;
  config?: DefaultConfig;
}

export function syncForkBranchAndUpdateLocal({
  UPSTREAM_REPO_OWNER,
  FORK_REPO_OWNER,
  REPO_NAME,
  syncTargetBranch,
  config = {},
}: SyncForkBranchParams) {
  const { debug = true } = config;

  try {
    const forkRepoRemoteAlias = findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => {
        console.error(
          `❌ Failed to find remote alias for the fork repository: ${UPSTREAM_REPO_OWNER}/${REPO_NAME}. Please add it first.\n` +
            `👉 To add the fork repository remote, run the following command:\n` +
            `\n` +
            `   💻 git remote add "fork_repo_remote_alias" "fork_repo_url"\n` +
            `\n` +
            `🔗 This will allow you to fetch updates from the upstream repository.\n`,
        );
      },
    });

    const upstreamRepoRemoteAlias = findRemoteAlias(`${UPSTREAM_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => {
        console.error(
          `❌ Failed to find remote alias for the upstream repository: ${UPSTREAM_REPO_OWNER}/${REPO_NAME}. Please add it first.\n` +
            `👉 To add the upstream repository remote, run the following command:\n` +
            `\n` +
            `   💻 git remote add "upstream_repo_remote_alias" "upstream_repo_url"\n` +
            `\n` +
            `🔗 This will allow you to fetch updates from the upstream repository.\n`,
        );
      },
    });

    // Fetch updates from the upstream repository
    executeCommand(`git fetch ${upstreamRepoRemoteAlias}`, {
      onSuccess: () => {
        log(debug, () => console.log(`✅ Fetched upstream(${upstreamRepoRemoteAlias}) changes.`));
      },
    });

    // Switch to the target branch
    executeCommand(`git checkout ${syncTargetBranch}`, {
      onSuccess: () => {
        log(debug, () => console.log(`✅ Checked out branch: ${syncTargetBranch}.`));
      },
      onError: () => {
        console.error(`❌ Failed to checkout branch: ${syncTargetBranch}. check your local branch list first.`);
      },
    });

    // Pull updates from the upstream branch
    executeCommand(`git pull ${upstreamRepoRemoteAlias} ${syncTargetBranch}`, {
      onSuccess: () => {
        log(debug, () => console.log(`✅ Pulled updates from ${upstreamRepoRemoteAlias}/${syncTargetBranch}.`));
      },
      onError: () => {
        console.error(`❌ Failed to pull: ${syncTargetBranch} when synchronizing with ${upstreamRepoRemoteAlias}.`);
      },
    });

    // Push updates to the forked repository
    executeCommand(`git push ${forkRepoRemoteAlias} ${syncTargetBranch}`, {
      onSuccess: () => {
        log(debug, () => console.log(`✅ Pushed updates to ${forkRepoRemoteAlias}/${syncTargetBranch}.`));
      },
      onError: () => {
        console.error(`❌ Failed to push: ${syncTargetBranch} when synchronizing with ${forkRepoRemoteAlias}.`);
      },
    });

    //callback
    config?.onSuccess?.();
  } catch (error) {
    console.error(`❌ Error during sync: ${error}`);
    process.exit();
  }
}

import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils/executeCommand'; // Adjust the import path as needed
import { findRemoteAlias } from './findRemoteAlias';
import { PROCESS_EXIT, log } from '@/utils/common-utils';
import fetchBranch, { createFetchBranchErrorMessage, createFetchBranchSuccessMessage } from './fetchBranch';
import switchBranch, { createSwitchBranchErrorMessage, createSwitchBranchSuccessMessage } from './switchBranch';
import { createCurrentBranchNameErrorMessage, getCurrentBranchName } from './getCurrentBranchName';

interface SyncForkBranchParams {
  ORIGIN_REPO_OWNER?: string;
  REPO_NAME?: string;
  syncTargetBranch?: string;
  config?: DefaultConfig;
}

export function syncLocalBranchWithOrigin({
  ORIGIN_REPO_OWNER,
  REPO_NAME,
  syncTargetBranch,
  config = {},
}: SyncForkBranchParams) {
  const { debug = true } = config;

  try {
    const originRepoRemoteAlias = findRemoteAlias(`${ORIGIN_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => {
        console.error(
          `\n🚫 Failed to find remote alias for the upstream repository: ${ORIGIN_REPO_OWNER}/${REPO_NAME}. Please add it first.\n` +
            `👉 To add the upstream repository remote, run the following command:\n` +
            `\n` +
            `   💻 git remote add "upstream_repo_remote_alias" "upstream_repo_url"\n` +
            `\n` +
            `🔗 This will allow you to fetch updates from the upstream repository.\n`,
        );
      },
    });

    // Fetch updates from the upstream repository
    fetchBranch(
      { remoteAlias: originRepoRemoteAlias },
      {
        onSuccess: () => {
          log(debug, () => console.log(createFetchBranchSuccessMessage({ remoteAlias: originRepoRemoteAlias })));
        },
        onError: () => console.error(createFetchBranchErrorMessage({ remoteAlias: originRepoRemoteAlias })),
        execSyncOptions: {
          stdio: 'ignore',
        },
      },
    );

    // Switch to the target branch
    const currentBranch = getCurrentBranchName({ onError: () => console.error(createCurrentBranchNameErrorMessage()) });
    if (currentBranch !== syncTargetBranch) {
      switchBranch(
        { branchName: syncTargetBranch },
        {
          onSuccess: () => {
            log(debug, () => createSwitchBranchSuccessMessage({ branchName: syncTargetBranch }));
          },
          onError: (error) => {
            console.error(createSwitchBranchErrorMessage({ branchName: syncTargetBranch }));
            console.error(error);
          },
          execSyncOptions: {
            stdio: 'ignore',
          },
        },
      );
    }

    // merge branch
    executeCommand(`git merge ${originRepoRemoteAlias}/${syncTargetBranch}`, {
      onSuccess: () => {
        log(debug, () => console.log(`✅ Merged ${ORIGIN_REPO_OWNER}/${syncTargetBranch}.`));
      },
      onError: (error) => {
        console.error(
          `\n🚫 Failed to merge: ${syncTargetBranch} when synchronizing with ${originRepoRemoteAlias}.\nPlease commit your changes or stash them before you merge.\nAborting`,
        );
        console.error(error);
      },
      execSyncOptions: {
        stdio: 'ignore',
      },
    });

    //callback
    config?.onSuccess?.();
  } catch (error) {
    console.error(`\n🚫 Error during sync: ${error}`);
    PROCESS_EXIT();
  }
}

import { DefaultConfig } from '@/types';
import { executeCommand, PROCESS_EXIT } from '@/utils';

export function deleteLocalBranches(localBranchNames: string[]) {
  if (!localBranchNames.length) return;

  try {
    localBranchNames.forEach((branchName) => {
      executeCommand(`git branch -D ${branchName}`, {
        exitWhenError: false,
        onError: () => deleteLocalBranchesErrorMessage(branchName),
      });
    });
  } catch {
    PROCESS_EXIT();
  }
}

export function deleteLocalBranchesErrorMessage(branchName: string) {
  console.log(`👀 If your branch is issue branch to delete, please switch to the other branch and try again`);
}

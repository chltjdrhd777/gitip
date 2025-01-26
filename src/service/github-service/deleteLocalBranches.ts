import { executeCommand, PROCESS_EXIT } from '@/utils';

export function deleteLocalBranches(localBranchNames: string[]) {
  if (!localBranchNames.length) return;

  try {
    localBranchNames.forEach((branchName) => {
      executeCommand(`git branch -d ${branchName}`, {
        exitWhenError: false,
      });
    });

    return deleteLocalBranches;
  } catch {
    createDeleteLocalBranchesErrorMessage();
    PROCESS_EXIT();
  }
}

export function createDeleteLocalBranchesErrorMessage() {
  return `\n🚫 Failed to delete local branches`;
}

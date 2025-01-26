import { executeCommand } from '@/utils';

export function deleteLocalBranches(localBranchNames: string[]) {
  if (!localBranchNames.length) return;

  localBranchNames.forEach((branchName) => {
    executeCommand(`git branch -D ${branchName}`, { exitWhenError: false });
  });
}

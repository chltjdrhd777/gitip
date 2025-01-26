import { executeCommand } from '@/utils';

export function deleteRemoteBranches(remoteBranchNames: string[]) {
  if (!remoteBranchNames.length) return;

  remoteBranchNames.forEach((branchName) => {
    executeCommand(`git push origin --delete ${branchName}`, { exitWhenError: false });
  });
}

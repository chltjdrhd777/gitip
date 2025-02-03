import { executeCommand, PROCESS_EXIT } from '@/utils';

export function deleteRemoteBranches(remoteBranchNames: string[], remoteAlias: string) {
  if (!remoteBranchNames.length) return;

  if (!remoteAlias) {
    console.error('❌ Remote alias is not provided. Please check your git remote list first');
    PROCESS_EXIT();
  }

  // 1. Verify Git authentication
  executeCommand('git ls-remote', {
    exitWhenError: false,
    onError: () => {
      console.error('❌ Git authentication failed. Please check your credentials and try again.');
      PROCESS_EXIT();
    },
  });

  // 2. Filter out invalid branch names
  if (!remoteBranchNames.length) {
    return;
  }

  try {
    remoteBranchNames.forEach((branchName) => {
      executeCommand(`git push ${remoteAlias} --delete ${branchName}`, {
        exitWhenError: false,
      });
    });
  } catch {}
}

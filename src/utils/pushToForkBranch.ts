import { executeCommand } from './executeCommand';

export default function pushToForkBranch(forkRemoteAlias: string, currentBranchName: string) {
  return executeCommand(`git push ${forkRemoteAlias} ${currentBranchName}`);
}

import { DefaultConfig } from '@/types';
import { executeCommand } from '../common-utils';

interface FetchBranchesWithPruneConfig extends DefaultConfig {}

export default function fetchBranchesWithPrune(
  forkRepoRemoteAlias: string,
  fetchBranchesWithPruneConfig?: FetchBranchesWithPruneConfig,
) {
  if (!forkRepoRemoteAlias) return;

  executeCommand(`git fetch --prune ${forkRepoRemoteAlias}`, fetchBranchesWithPruneConfig);
}

export function createFetchBranchesWithPruneErrorMessage({ forkRepoRemoteAlias }: { forkRepoRemoteAlias: string }) {
  return `\n🚫 Failed to fetch branches from ${forkRepoRemoteAlias} repository. please check your branches on fork repository first\n`;
}

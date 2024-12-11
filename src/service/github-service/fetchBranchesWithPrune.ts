import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils';

interface FetchBranchesWithPruneConfig extends DefaultConfig {}

export default function fetchBranchesWithPrune(
  remoteAlias: string,
  fetchBranchesWithPruneConfig?: FetchBranchesWithPruneConfig,
) {
  if (!remoteAlias) return;

  executeCommand(`git fetch --prune ${remoteAlias}`, fetchBranchesWithPruneConfig);
}

export function createFetchBranchesWithPruneErrorMessage({ remoteAlias }: { remoteAlias: string }) {
  return `\n🚫 Failed to fetch branches from ${remoteAlias} repository. please check your branches on fork repository first\n`;
}

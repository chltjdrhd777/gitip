import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils';

interface FetchBranchParams {
  remoteAlias?: string;
  isPrune?: boolean;
}

interface FetchBranchesConfig extends DefaultConfig {}

export default function fetchBranch(fetchBranchParams: FetchBranchParams, fetchBranchesConfig?: FetchBranchesConfig) {
  const { remoteAlias, isPrune = true } = fetchBranchParams;

  if (!remoteAlias) return;

  console.log('fetch command:', `git fetch ${isPrune ? '--prune' : ''} ${remoteAlias}`);

  executeCommand(`git fetch ${isPrune ? '--prune' : ''} ${remoteAlias}`, fetchBranchesConfig);
}

export function createFetchBranchErrorMessage({ remoteAlias }: { remoteAlias?: string }) {
  return `\n🚫 Failed to fetch branches from ${remoteAlias} repository. please check your branches on fork repository first\n`;
}

export function createFetchBranchSuccessMessage({ remoteAlias }: { remoteAlias?: string }) {
  return `\n\n✅ Fetched branches from ${remoteAlias} repository`;
}

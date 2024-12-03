import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils/executeCommand';

interface GetCurrentBranchMetadataConfig extends DefaultConfig {}

export function getCurrentBranchMetadata(getCurrentBranchMetadataConfig?: GetCurrentBranchMetadataConfig) {
  const branchName = executeCommand('git rev-parse --abbrev-ref HEAD', getCurrentBranchMetadataConfig)
    ?.toString()
    ?.trim();

  if (branchName) {
    const issueNumber = branchName.match(/issue-(.*)/)?.[1];

    if (!issueNumber) {
      console.log('🚫 failed to get issue number. please switch to issue branch');
      return null;
    }

    return {
      branchName,
      issueNumber,
    };
  }

  return null;
}

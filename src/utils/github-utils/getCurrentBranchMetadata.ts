import { DefaultConfig } from '@/types';
import { getCurrentBranchName, createCurrentBranchNameErrorMessage } from './getCurrentBranchName';
import { PROCESS_EXIT } from '../common-utils';
import { highlighted } from '@/constants/colors';

export interface BranchMetadata {
  branchName: string;
  issueNumber: string;
}

export function getCurrentBranchMetadata() {
  const branchName = getCurrentBranchName({
    onError: () => console.error(createCurrentBranchNameErrorMessage()),
  });

  if (branchName) {
    const issueNumber = branchName.match(/-#(\d+)$/)?.[1];

    if (!issueNumber) {
      console.error(createBranchIssueNumberErrorMessage());
      PROCESS_EXIT();
    }

    return {
      branchName: branchName ?? '',
      issueNumber: issueNumber ?? '',
    };
  } else {
    console.error(createCurrentBranchNameErrorMessage());
    PROCESS_EXIT();
  }
}

export function createBranchIssueNumberErrorMessage() {
  const highlightedExampleIssueBranchName = highlighted('test-#1234', ['bold', 'yellow']);

  return `\n🚫 Failed to extract the issue number from the branch name.\n The branch name should end with "-#issueNumber"${highlightedExampleIssueBranchName}\n - Please switch to the correct issue branch`;
}

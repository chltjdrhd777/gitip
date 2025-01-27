import { ISSUE_BRANCH_TO_CLEAN_PATTERN } from '@/constants/regularExpression';
import { getCurrentBranchName } from './getCurrentBranchName';
import { PROCESS_EXIT } from '@/utils';
import { ColorCode } from '@/constants/colors';

export function checkCurrentBranchIsIssueBranch() {
  const currentBranchName = getCurrentBranchName();

  if (currentBranchName.match(ISSUE_BRANCH_TO_CLEAN_PATTERN)) {
    console.log(
      `🚫 current branch "[${ColorCode.magenta(
        currentBranchName,
      )}]" is issue branch in the delete scope. please switch to another branch and try again`,
    );
    PROCESS_EXIT();
  }
}

interface CreateIssueBranchNameParams {
  issueBranchName: string;
  issueNumber: string;
}

export function createIssueBranchName({ issueBranchName, issueNumber }: CreateIssueBranchNameParams) {
  return `${issueBranchName}-#${issueNumber}`;
}

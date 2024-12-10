interface GetPRBodyParams {
  bodyFromCommit: string;
  issueNumberFromBranch: string;
}

export function getPRBody({ bodyFromCommit, issueNumberFromBranch }: GetPRBodyParams) {
  return bodyFromCommit + `${bodyFromCommit ? '\n\n' : ''} close #${issueNumberFromBranch}`;
}

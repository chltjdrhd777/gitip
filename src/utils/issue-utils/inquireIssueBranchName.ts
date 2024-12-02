import { input } from '@inquirer/prompts';

export async function inquireIssueBranchName() {
  const issueBranchName = await input({
    message: 'Enter issue branch name(optional/default: issue):',
    default: 'issue',
  });

  return issueBranchName;
}

import { executeCommand } from './executeCommand';

export default function getCurrentBranchMetadata() {
  const branchName = executeCommand('git rev-parse --abbrev-ref HEAD')?.toString()?.trim();

  if (branchName) {
    const issueNumber = branchName.match(/issue-(.*)/)?.[1];

    if (!issueNumber) return null;

    return {
      branchName,
      issueNumber,
    };
  }

  return null;
}

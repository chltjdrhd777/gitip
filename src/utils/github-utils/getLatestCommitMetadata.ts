import { executeCommand } from '@/utils/common-utils/executeCommand';

export function getLatestCommitMetadata() {
  const commit = executeCommand('git log --format=%s%n%b -n 1')?.toString();

  if (commit) {
    const [title, ...bodyArray] = commit.split('\n');
    const body = bodyArray.filter((e) => e !== '').join('\n');

    return { title, body };
  }

  return null;
}

import { executeCommand } from '@/utils/common-utils/executeCommand';

export function checkGithubAuth() {
  return executeCommand('gh auth status');
}

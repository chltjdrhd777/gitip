import { executeCommand } from '@/utils/common-utils/executeCommand';

export function checkGithubCLI() {
  return executeCommand('gh --version');
}

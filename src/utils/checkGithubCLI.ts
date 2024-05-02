import { executeCommand } from './executeCommand';

export default function checkGithubCLI() {
  return executeCommand('gh --version');
}

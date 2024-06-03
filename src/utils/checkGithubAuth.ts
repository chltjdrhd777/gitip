import { executeCommand } from './executeCommand';

export default function checkGithubAuth() {
  return executeCommand('gh auth status');
}

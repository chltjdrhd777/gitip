import { executeCommand } from './executeCommand';

export default function getCurrentBranch() {
  return executeCommand('git rev-parse --abbrev-ref HEAD')?.toString()?.trim() ?? '';
}

import { executeCommand } from './executeCommand';

export default function getBranchList() {
  return executeCommand('git branch --list')?.toString() ?? '';
}

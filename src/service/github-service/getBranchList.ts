import { executeCommand } from '@/utils/common-utils/executeCommand';

export function getBranchList() {
  return executeCommand('git branch --list')?.toString() ?? '';
}

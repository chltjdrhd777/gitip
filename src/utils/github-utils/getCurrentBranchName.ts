import { executeCommand } from '@/utils/common-utils/executeCommand';

export function getCurrentBranchName() {
  return executeCommand('git rev-parse --abbrev-ref HEAD')?.toString()?.trim() ?? '';
}

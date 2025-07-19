import { executeCommand } from '@/utils';

export function getBranchDiff() {
  const DEFAULT_BRANCH_NAME = process.env.DEFAULT_BRANCH_NAME;

  if (!DEFAULT_BRANCH_NAME) {
    return '';
  }

  try {
    const mergeBase = executeCommand(`git merge-base HEAD ${DEFAULT_BRANCH_NAME}`)?.toString().trim();

    const diff = executeCommand(`git diff ${mergeBase}..HEAD`)?.toString();
    return diff;
  } catch (error: any) {
    console.error('Git 명령 실행 중 오류:', error.message);
    process.exit(1);
  }
}

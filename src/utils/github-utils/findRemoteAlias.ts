import { executeCommand } from '@/utils/common-utils/executeCommand';

export async function findRemoteAlias(targetPath: string) {
  const remoteAlias = executeCommand(`git remote -v | grep '${targetPath}' | awk '{print $1}'`)?.toString()?.trim();

  return remoteAlias?.split(/\n/)[0];
}

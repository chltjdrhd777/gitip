import { executeCommand } from '@/utils/common-utils/executeCommand';

export async function findRemoteAlias(targetPath: string) {
  // | = pipe
  // grep = search
  // awk = text processing tool(space-separated)
  // print = print the matched line
  // $1 = first column
  const remoteAlias = executeCommand(`git remote -v | grep '${targetPath}' | awk '{print $1}'`)?.toString()?.trim();

  return remoteAlias?.split(/\n/)[0];
}

import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils/executeCommand';
import { PROCESS_EXIT } from '@/utils/common-utils';

interface findRemoteAliasConfig extends DefaultConfig {}

export function findRemoteAlias(targetPath: string, config?: findRemoteAliasConfig) {
  const { onSuccess, onError, exitWhenError = false } = config ?? {};
  // | = pipe
  // grep = search
  // awk = text processing tool(space-separated)
  // print = print the matched line
  // $1 = first column
  const remoteAlias = executeCommand(`git remote -v | grep '${targetPath}' | awk '{print $1}'`, {
    exitWhenError,
  })
    ?.toString()
    ?.trim(); // buffer to string 변환 결과가 없어야 하므로 exitWhenError을 false로 설정한다.

  if (!remoteAlias) {
    onError?.();
    PROCESS_EXIT();
  }

  onSuccess?.();
  return (remoteAlias ?? '')?.split(/\n/)[0];
}

export function createFindRemoteAliasErrorMessage({ targetRepo }: { targetRepo: string }) {
  return `\n🚫 No remote for "${targetRepo} repository". please add it first\nRun : \x1b[36mgit remote add {${targetRepo} repository alias} {${targetRepo} repository url}\x1b[0m`;
}

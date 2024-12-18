import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils/common-utils/executeCommand';
import { PROCESS_EXIT } from '@/utils/common-utils';

interface GetLatestCommitMetadataConfig extends DefaultConfig {}

export interface CommitMetadata {
  title: string;
  body: string;
}

export function getLatestCommitMetadata(getLatestCommitMetadataConfig?: GetLatestCommitMetadataConfig) {
  const { onError, onSuccess } = getLatestCommitMetadataConfig ?? {};

  const commit = executeCommand('git log --format=%s%n%b -n 1', {
    exitWhenError: false,
    ...getLatestCommitMetadataConfig,
  })?.toString();

  if (commit) {
    const [title, ...bodyArray] = (commit ?? '').split('\n');
    const body = (bodyArray ?? []).filter((e) => e !== '').join('\n');

    onSuccess?.({ title, body });
    return { title, body };
  } else {
    onError?.();
    PROCESS_EXIT();
  }
}

export function getLatestCommitMetadataErrorMessage() {
  return `\n🚫 Failed to load the latest commit data.`;
}

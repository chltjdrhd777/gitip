import { ExecOptions, ExecSyncOptions } from 'child_process';

export type GitipCommandType = 'issue' | 'pr' | 'sync' | 'clean';

export interface Callbacks<ErrorArgs = any, SuccessArgs = any> {
  onSuccess?: (args?: SuccessArgs) => any;
  onError?: (args?: ErrorArgs) => any;
}

export interface DefaultConfig<ErrorArgs = any, SuccessArgs = any> extends Callbacks<ErrorArgs, SuccessArgs> {
  debug?: boolean;
  exitWhenError?: boolean;
  execOptions?: ExecOptions;
  execSyncOptions?: ExecSyncOptions;
}

import { DefaultConfig } from '@/types';
import { exec, execSync } from 'child_process';
import { PROCESS_EXIT } from './PROCESS_EXIT';

interface ExecuteCommandConfig extends DefaultConfig {
  async?: boolean; // 비동기 처리 여부
}

/**
 * child process studio 옵션 정리
 * 1. pipe : 자식 프로세스의 처리 결과 버퍼를 캡쳐한 인스턴스 반환(toString등 메서드를 통해서 버퍼 처리 가능)
 * 2. stdio : 자식 프로세스의 처리 결과 버퍼를 캡쳐하지 않고 직접 부모 프로세스의 stdin, stdout에 접근하여 콘솔에 표출
 * 3. ignore : 캡쳐하지 않고, 부모 프로세스에도 표출하지 않음.
 */

export function executeCommand(
  command: string,
  executeCommandConfig: ExecuteCommandConfig = {},
): (typeof executeCommandConfig)['async'] extends true ? Promise<string | Buffer> : string | Buffer | undefined {
  const {
    onSuccess,
    onError,
    exitWhenError = true,
    async = false,
    execOptions = {},
    execSyncOptions = {},
  } = executeCommandConfig;

  if (async) {
    return new Promise((resolve, reject) => {
      exec(command, execOptions, (error, stdout, stderr) => {
        if (error) {
          onError?.(error);
          if (exitWhenError) {
            PROCESS_EXIT();
          }
          reject(error);
        } else {
          onSuccess?.(stdout);
          resolve(stdout);
        }
      });
    }) as (typeof executeCommandConfig)['async'] extends true ? Promise<string | Buffer> : never;
  } else {
    try {
      const executeResult = execSync(command, execSyncOptions);
      onSuccess?.(executeResult);
      return executeResult;
    } catch (error) {
      onError?.(error);
      if (exitWhenError) {
        PROCESS_EXIT();
      }
      return undefined;
    }
  }
}

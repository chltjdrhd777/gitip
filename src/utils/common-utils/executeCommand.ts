import { DefaultConfig } from '@/types';
import { ExecSyncOptions, execSync } from 'child_process';
import { PROCESS_EXIT } from './PROCESS_EXIT';

interface ExecuteCommandConfig extends DefaultConfig {
  execSyncOptions?: ExecSyncOptions;
}

/**
 * child process studio 옵션 정리
 * 1. pipe : 자식 프로세스의 처리 결과 버퍼를 캡쳐한 인스턴스 반환(toString등 메서드를 통해서 버퍼 처리 가능)
 * 2  stdio : 자식 프로세스의 처리 결과 버퍼를 캡쳐하지 않고 직접 부모 프로세스의 stdin,stdout에 접근하여 콘솔에 표출
 * 3. ignore : 캡쳐하지 않고, 부모 프로세스에도 표출하지 않음.
 */

export function executeCommand(command: string, executeCommandConfig: ExecuteCommandConfig = {}) {
  const { onSuccess, onError, exitWhenError = true, execSyncOptions } = executeCommandConfig;

  try {
    const executeResult = execSync(command, execSyncOptions);
    onSuccess?.(executeResult);
    return executeResult;
  } catch (err) {
    // console.error(`\n🚫 Command Failed: ${command}`);
    onError?.(err);

    if (exitWhenError) {
      PROCESS_EXIT();
    }
  }
}

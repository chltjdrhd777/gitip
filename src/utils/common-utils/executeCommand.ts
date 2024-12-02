import { Callbacks, DefaultConfig } from '@/types';
import { execSync } from 'child_process';
import { PROCESS_EXIT } from './PROCESS_EXIT';

interface ExecuteCommandConfig extends DefaultConfig {}

export function executeCommand(command: string, executeCommandConfig: ExecuteCommandConfig = {}) {
  const { onSuccess, onError, exitWhenError = true } = executeCommandConfig;

  try {
    const executeResult = execSync(command);
    onSuccess?.(executeResult);
    return executeResult;
  } catch (err) {
    console.error(`❌ Command failed: ${command}`);
    onError?.(err);

    if (exitWhenError) {
      PROCESS_EXIT();
    }
  }
}

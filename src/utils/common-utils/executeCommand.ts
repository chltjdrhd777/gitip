import { Callbacks, DefaultConfig } from '@/types';
import { execSync } from 'child_process';

interface ExecuteCommandConfig extends Callbacks, DefaultConfig {}

export function executeCommand(command: string, executeCommandConfig: ExecuteCommandConfig = {}) {
  const { debug = true, onSuccess, onSettled, onError } = executeCommandConfig;

  try {
    const executeResult = execSync(command, { stdio: debug ? 'pipe' : 'ignore' });
    onSuccess?.(executeResult);
    onSettled?.(executeResult);
    return executeResult;
  } catch (err) {
    if (debug) console.error(`❌ Command failed: ${command}`);
    onError?.(err);
    return null;
  }
}

import { Callbacks } from '@/types';
import { execSync } from 'child_process';

interface ExecuteCommandConfig extends Callbacks {
  debug?: boolean;
}

export function executeCommand(
  command: string,
  { debug = true, onSuccess, onError, onSettled }: ExecuteCommandConfig = {},
) {
  try {
    const executeResult = execSync(command);
    onSuccess?.(executeResult);
    onSettled?.(executeResult);
    return executeResult;
  } catch (err) {
    if (debug) console.error(`❌ Command failed: ${command}`);
    onError?.(err);
    return null;
  }
}

import { execSync } from 'child_process';

export function executeCommand(command: string) {
  try {
    return execSync(command);
  } catch (err) {
    return null;
  }
}

import { execSync } from 'child_process';

export async function executeCommand(command: string) {
  try {
    return execSync(command);
  } catch (err) {
    return null;
  }
}

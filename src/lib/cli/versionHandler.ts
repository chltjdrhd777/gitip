import { readFileSync } from 'fs';
import path from 'path';

export function showVersion(): void {
  try {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    console.log(`🔔 Version: ${packageJson.version}`);
  } catch (error) {
    console.error('Error reading package version:', (error as Error).message);
  }
}

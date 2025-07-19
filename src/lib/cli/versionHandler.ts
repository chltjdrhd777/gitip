import { readFileSync } from 'fs';
import path from 'path';

export function showVersion(): void {
  try {
    const version = getVersion();

    console.log(`🔔 Version: ${version}`);
  } catch (error) {
    console.error('Error reading package version:', (error as Error).message);
  }
}

export function getVersion(): string {
  try {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    return packageJson.version;
  } catch (error) {
    console.error('Error reading package version:', (error as Error).message);
    return '0.0.0';
  }
}

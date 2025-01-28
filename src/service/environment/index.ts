import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ColorCode } from '@/constants/colors';
import { PROCESS_EXIT } from '@/utils';

class EnvStore {
  private ORIGIN_REPO_FLAG = 'ORIGIN_REPO_OWNER';
  private ENV_FILENAME_PATTERN = /^\.env(\.[^.\s]+)*$/;
  private ENV_FILENAME_PATTERN_EXCEPTIONAL = /\.env\.(?!local$|test$|development$|production$)[^.\s]+$/;
  private PRIORITY_ENV_PATTERNS = ['.env.local', '.env.test', '.env.development', '.env.production', '.env.*', '.env'];
  private PRIORITY_ENV_PATTERNS_MAP = new Map<string, number>(
    this.PRIORITY_ENV_PATTERNS.map((pattern, idx) => [pattern, idx]),
  );

  private envState: Record<string, string> = {};

  load(): void {
    const envNameToLoad = this.getEnvNameToLoad();
    const envFilePath = path.join(process.cwd(), envNameToLoad);

    dotenv.config({ path: envFilePath, processEnv: this.envState });
    Object.assign(process.env, this.envState);
  }

  get(key: string): string | undefined {
    return this.envState[key];
  }

  getAll(): Record<string, string> {
    return { ...this.envState };
  }

  hasOriginFlag() {
    return Boolean(this.get(this.ORIGIN_REPO_FLAG));
  }

  //helper
  getEnvNameToLoad() {
    const currentDir = fs.readdirSync(process.cwd());
    const envFiles = currentDir.filter((file) => file.match(this.ENV_FILENAME_PATTERN));

    if (!envFiles.length) {
      console.log(
        `🚫 No .env file found in the current directory. Please create one:\n\n` +
          `💡 ${ColorCode.white('Environment file priorities:\n')}\n` +
          this.PRIORITY_ENV_PATTERNS.map((pattern, idx) => `${idx + 1}. ${pattern}`).join('\n') +
          '\n\n',
      );

      PROCESS_EXIT();
    }

    envFiles.sort((a, b) => {
      const getPriority = (name: string): number => {
        if (name === '.env') {
          return this.PRIORITY_ENV_PATTERNS_MAP.get('.env') ?? Number.MAX_SAFE_INTEGER;
        }

        if (this.ENV_FILENAME_PATTERN_EXCEPTIONAL.test(name)) {
          return this.PRIORITY_ENV_PATTERNS_MAP.get('.env.*') ?? Number.MAX_SAFE_INTEGER;
        }

        return this.PRIORITY_ENV_PATTERNS_MAP.get(name) ?? Number.MAX_SAFE_INTEGER;
      };

      return getPriority(a) - getPriority(b);
    });

    return envFiles[0];
  }
}

export const envStore = new EnvStore();

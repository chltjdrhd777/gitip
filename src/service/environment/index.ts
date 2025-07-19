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
  private DEFAULT_ENV_CONTENTS = {
    GIT_ACCESS_TOKEN: '"your-github-access-token"',
    REPO_NAME: '"repository-name"',
    DEFAULT_BRANCH_NAME: '"default-branch-name"',
    FORK_REPO_OWNER: '"set-this-for-fork-repo-system"', // fork 용
    UPSTREAM_REPO_OWNER: '"set-this-for-fork-repo-system"', // fork 용
    ORIGIN_REPO_OWNER: '"set-this-for-origin-repo-system"', // origin 용
    TEMPLATE_TITLE_PLACEHOLDER: '"(optional) issue template title placeholder"',
  };

  private envState: Record<string, string> = {};

  public load = (): void => {
    const envNameToLoad = this.getEnvNameToLoad();
    const envFilePath = path.join(process.cwd(), envNameToLoad);

    dotenv.config({ path: envFilePath, processEnv: this.envState });
    Object.assign(process.env, this.envState);
  };

  public get = (key: string): string | undefined => {
    return this.envState[key];
  };

  public getAll = (): Record<string, string> => {
    return { ...this.envState };
  };

  public hasOriginFlag = () => {
    return Boolean(this.get(this.ORIGIN_REPO_FLAG));
  };

  //helper
  public getEnvNameToLoad = (params?: { exitWhenError?: boolean }) => {
    const { exitWhenError = true } = params ?? {};

    const currentDir = fs.readdirSync(process.cwd());
    const envFiles = currentDir.filter((file) => file.match(this.ENV_FILENAME_PATTERN));

    if (!envFiles.length && exitWhenError) {
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
  };

  public init = (): void => {
    const envNameToLoad = this.getEnvNameToLoad({ exitWhenError: false });

    if (envNameToLoad) {
      console.log(`👀 There is already environment file: ${ColorCode.white(envNameToLoad)}. Inserting missing keys...`);

      const envFilePath = path.join(process.cwd(), envNameToLoad);
      const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
      const parsedEnv = dotenv.parse(envFileContent); // 기존 env 값 파싱

      const missingKeys = Object.entries(this.DEFAULT_ENV_CONTENTS)
        .filter(([key]) => !parsedEnv[key]) // 존재하지 않는 키만 필터링
        .map(([key, value]) => `${key}=${value}`);

      if (missingKeys.length > 0) {
        fs.appendFileSync(envFilePath, '\n' + missingKeys.join('\n') + '\n');
        console.log(`✅ Updated .env file with missing keys.`);
      } else {
        console.log(`👌 .env file is already up-to-date.`);
      }
    } else {
      console.log(`📄 Creating new ${ColorCode.white('.env')} file with default settings...`);

      const defaultEnvContent = Object.entries(this.DEFAULT_ENV_CONTENTS)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      fs.writeFileSync(path.join(process.cwd(), '.env'), '# gitip environment variables\n' + defaultEnvContent + '\n');

      console.log(`🎉 Created new .env file successfully.`);
    }
  };
}

export const envStore = new EnvStore();

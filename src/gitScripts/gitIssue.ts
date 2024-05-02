import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import { checkIsRequiredVariablesExist, checkGithubCLI, installGithubCLI } from '@/utils';

/**@PRE_REQUISITE */
const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const REMOTE_REPO_OWNER = process.env.REMOTE_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const GIT_API_URL = `https://api.github.com/repos/${REMOTE_REPO_OWNER}/${REPO_NAME}/issues`;

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */
    //1. check required variables
    const isExistRequiredVars = checkIsRequiredVariablesExist({
      GIT_ACCESS_TOKEN,
      REMOTE_REPO_OWNER,
      FORK_REPO_OWNER,
      REPO_NAME,
    });

    if (!isExistRequiredVars.status) {
      return console.log(
        `🕹 please set the required variables on the ".env"\n${isExistRequiredVars.emptyVariablekeys
          .map((e, i) => `${i + 1}. ${e}`)
          .join('\n')}`,
      );
    }

    //2. check git CLI
    const isGithubCLIExist = await checkGithubCLI();

    if (!isGithubCLIExist) {
      await installGithubCLI();
    }
  } catch (err) {
    console.log('failed to create github issue', err);
  }
})();

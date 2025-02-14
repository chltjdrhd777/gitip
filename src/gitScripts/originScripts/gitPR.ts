import {
  BranchMetadata,
  CommitMetadata,
  createCurrentBranchNameErrorMessage,
  createFindRemoteAliasErrorMessage,
  createPushToTargetBranchErrorMessage,
  findRemoteAlias,
  getCurrentBranchMetadata,
  getCurrentBranchName,
  getLatestCommitMetadata,
  getLatestCommitMetadataErrorMessage,
  pushToTargetBranch,
} from '@/service';
import { checkRequiredVariablesExist, loadEnv, createCheckRequiredVariablesExistErrorMessage } from '@/utils';
import { getPRBody, getPRTitle, getPrefixEmoji, inquirePRTitle } from '@/utils/pr-utils';
import { assignPRToUser } from '@/utils/pr-utils/assignPRToUser';
import { createGitHubPR } from '@/service/github-service';

//PREREQUISITE
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const ORIGIN_REPO_OWNER = process.env.ORIGIN_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const DEFAULT_BRANCH_NAME = process.env.DEFAULT_BRANCH_NAME;
const GIT_API_URL = `https://api.github.com/repos/${ORIGIN_REPO_OWNER}/${REPO_NAME}/pulls`;

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */

    //0. check variables required first
    checkRequiredVariablesExist(
      {
        GIT_ACCESS_TOKEN,
        ORIGIN_REPO_OWNER,
        REPO_NAME,
        DEFAULT_BRANCH_NAME,
      },
      {
        onError: (variables) => console.error(createCheckRequiredVariablesExistErrorMessage({ variables })),
      },
    );

    //1. get current branch name
    const currentBranchName = getCurrentBranchName({
      onError: () => console.error(createCurrentBranchNameErrorMessage()),
    });

    //2. get remote alias for origin repository
    const originRepoRemoteAlias = findRemoteAlias(`${ORIGIN_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'fork' })),
    });

    //3. push changes to current branch on origin repository
    pushToTargetBranch(originRepoRemoteAlias, currentBranchName, {
      onError: () => console.error(createPushToTargetBranchErrorMessage({ REPO_OWNER: ORIGIN_REPO_OWNER, REPO_NAME })),
    });

    /**
     * @CREATE_PR
     */

    // 1. extract commit metadata
    const commitMetadata = getLatestCommitMetadata({
      onError: () => console.error(getLatestCommitMetadataErrorMessage()),
    }) as CommitMetadata;

    //2. select prefix emoji
    const emoji = getPrefixEmoji(commitMetadata?.title);

    //3. extract branch metadata
    const branchMetadata = getCurrentBranchMetadata() as BranchMetadata;

    //4. create PR title and PR body
    const PRTitleFromCommit = getPRTitle({ emoji, titleFromCommit: commitMetadata?.title });
    const PRTitle = await inquirePRTitle({ defaultValue: PRTitleFromCommit });
    const PRBody = getPRBody({
      bodyFromCommit: commitMetadata?.body,
      issueNumberFromBranch: branchMetadata?.issueNumber,
    });

    const requestBody = {
      title: PRTitle,
      body: PRBody,
      base: DEFAULT_BRANCH_NAME, //pr destination
      head: `${ORIGIN_REPO_OWNER}:${branchMetadata?.branchName}`, //pr origin(from)
    };

    //5. create PR
    const prResponse = await createGitHubPR({ requestBody, prType: 'origin', GIT_API_URL, GIT_ACCESS_TOKEN });

    if (prResponse) {
      await assignPRToUser({
        prNumber: prResponse.number,
        REPO_OWNER: ORIGIN_REPO_OWNER,
        ASSIGNEE: ORIGIN_REPO_OWNER,
        REPO_NAME,
        GIT_ACCESS_TOKEN,
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'test') {
      console.log('\n🚫 Failed to create github pull request', err);
    }
  }
})();

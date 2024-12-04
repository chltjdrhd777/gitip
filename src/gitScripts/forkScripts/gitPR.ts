import { COLORS } from '@/constants/colors';
import {
  checkIsRequiredVariablesExist,
  findRemoteAlias,
  getCurrentBranchMetadata,
  getCurrentBranchName,
  getLatestCommitMetadata,
  pushToTargetBranch,
  loadEnv,
  createCheckIsRequiredVariablesExistErrorMessage,
  createCurrentBranchNameErrorMessage,
  createFindRemoteAliasErrorMessage,
  getLatestCommitMetadataErrorMessage,
  CommitMetadata,
  BranchMetadata,
  createPushToTargetBranchErrorMessage,
  PROCESS_EXIT,
} from '@/utils';
import { getPRBody, getPRTitle, getPrefixEmoji, inquirePRTitle } from '@/utils/pr-utils';
import { assignPRToUser } from '@/utils/pr-utils/assignPRToUser';
import { createGitHubPR } from '@/utils/pr-utils/createGithubPR';

//PREREQUISITE
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const UPSTREAM_REPO_OWNER = process.env.UPSTREAM_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME;

const GIT_API_URL = `https://api.github.com/repos/${UPSTREAM_REPO_OWNER}/${REPO_NAME}/pulls`;

(async () => {
  try {
    /**
     * @PRE_SETTINGS
     */

    //0. check variables required first
    checkIsRequiredVariablesExist(
      {
        GIT_ACCESS_TOKEN,
        UPSTREAM_REPO_OWNER,
        FORK_REPO_OWNER,
        REPO_NAME,
        BRANCH_NAME,
      },
      {
        onError: (variables) => console.error(createCheckIsRequiredVariablesExistErrorMessage({ variables })),
      },
    );

    //1. get current branch name
    const currentBranchName = getCurrentBranchName({
      onError: () => console.error(createCurrentBranchNameErrorMessage()),
    });

    //2. push current change log to fork branch
    const forkRepoRemoteAlias = findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'fork' })),
    });

    //3. push to current branch on fork repository
    pushToTargetBranch(forkRepoRemoteAlias, currentBranchName, {
      onError: () => console.error(createPushToTargetBranchErrorMessage({ FORK_REPO_OWNER, REPO_NAME })),
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
      base: BRANCH_NAME, //pr destination
      head: `${FORK_REPO_OWNER}:${branchMetadata?.branchName}`, //pr origin(from)
    };

    //5. create PR
    const prResponse = await createGitHubPR({ requestBody, prType: 'fork', GIT_API_URL, GIT_ACCESS_TOKEN });

    if (prResponse) {
      await assignPRToUser({
        prNumber: prResponse.number,
        UPSTREAM_REPO_OWNER,
        FORK_REPO_OWNER,
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

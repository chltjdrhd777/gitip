import {
  BranchMetadata,
  CommitMetadata,
  createCurrentBranchNameErrorMessage,
  createFindRemoteAliasErrorMessage,
  createPushToTargetBranchErrorMessage,
  createPushToTargetBranchSuccessMessage,
  findRemoteAlias,
  getCurrentBranchMetadata,
  getCurrentBranchName,
  getLatestCommitMetadata,
  getLatestCommitMetadataErrorMessage,
  pushToTargetBranch,
} from '@/service';
import checkExistingPR from '@/service/github-service/checkExistingPR';

import {
  checkIsRequiredVariablesExist,
  loadEnv,
  createCheckIsRequiredVariablesExistErrorMessage,
  PROCESS_EXIT,
} from '@/utils';
import { getPRBody, getPRTitle, getPrefixEmoji, inquirePRTitle } from '@/utils/pr-utils';
import { askToUpdateExistingPR } from '@/utils/pr-utils/askToUpdateExistingPR';
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

    //2. get remote alias for fork repository
    const forkRepoRemoteAlias = findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`, {
      onError: () => console.error(createFindRemoteAliasErrorMessage({ targetRepo: 'fork' })),
    });

    // 3. extract commit metadata
    const commitMetadata = getLatestCommitMetadata({
      onError: () => console.error(getLatestCommitMetadataErrorMessage()),
    }) as CommitMetadata;

    //4. select prefix emoji
    const emoji = getPrefixEmoji(commitMetadata?.title);

    //5. extract branch metadata
    const branchMetadata = getCurrentBranchMetadata() as BranchMetadata;

    /**
     * @CREATE_PR
     */

    //1. check existing PR
    await checkExistingPR(
      {
        repoOwner: UPSTREAM_REPO_OWNER,
        repoName: REPO_NAME,
        head: `${FORK_REPO_OWNER}:${branchMetadata?.branchName}`,
        GIT_ACCESS_TOKEN,
      },
      {
        onSuccess: async (targetPR) => {
          if (targetPR) {
            // TODO : config에 의한 분기처리(strict mode)
            // 만약 strict mode일 경우 에러 메세지를 출력하고 프로세스를 종료한다. (새 변경점은 항상 새로운 pr에 해주세요)
            // 현재는 ask question
            await askToUpdateExistingPR({
              branchName: currentBranchName,
              prUrl: targetPR.html_url,
              onConfirm: () => {
                pushToTargetBranch(forkRepoRemoteAlias, currentBranchName, {
                  onSuccess: () => {
                    console.log(createPushToTargetBranchSuccessMessage());
                    PROCESS_EXIT();
                  },
                  onError: () =>
                    console.error(createPushToTargetBranchErrorMessage({ REPO_OWNER: FORK_REPO_OWNER, REPO_NAME })),
                });
              },
              onCancel: PROCESS_EXIT,
            });
          }
        },
      },
    );

    //2. push changes to current branch on fork repository
    pushToTargetBranch(forkRepoRemoteAlias, currentBranchName, {
      onError: () => console.error(createPushToTargetBranchErrorMessage({ REPO_OWNER: FORK_REPO_OWNER, REPO_NAME })),
    });

    //3. create PR title and PR body
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

    //4. create PR
    const prResponse = await createGitHubPR({ requestBody, prType: 'fork', GIT_API_URL, GIT_ACCESS_TOKEN });

    if (prResponse) {
      await assignPRToUser({
        prNumber: prResponse.number,
        REPO_OWNER: UPSTREAM_REPO_OWNER,
        ASSIGNEE: FORK_REPO_OWNER,
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

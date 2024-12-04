import { PREFIX_MAP } from '@/constants/prefixMap';
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
} from '@/utils';
import { getPrefixEmoji } from '@/utils/pr-utils';

//PREREQUISITE
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const UPSTREAM_REPO_OWNER = process.env.UPSTREAM_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME;

const GIT_API_URL = `https://api.github.com/repos/${UPSTREAM_REPO_OWNER}/${REPO_NAME}/pulls`;

(async () => {
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
  pushToTargetBranch(forkRepoRemoteAlias, currentBranchName);

  /**
   * @CREATE_PR
   */

  const commitMetadata = getLatestCommitMetadata({
    onError: () => console.error(getLatestCommitMetadataErrorMessage()),
  }) as CommitMetadata;

  //1. select prefix emoji
  const emoji = getPrefixEmoji(commitMetadata?.title);

  //2. generate Body
  const branchMetadata = getCurrentBranchMetadata() as BranchMetadata;

  //3. add close issue trigger to body
  const PRBody = commitMetadata?.body + `${commitMetadata?.body ? '\n\n' : ''} close #${branchMetadata?.issueNumber}`;

  const requestBody = {
    title: `${emoji}${commitMetadata.title}`,
    body: PRBody,
    base: BRANCH_NAME, //pr destination
    head: `${FORK_REPO_OWNER}:${branchMetadata.branchName}`, //pr origin(from)
  };

  //4. create PR
  const prResponse = await createGitHubPR({ requestBody });

  if (prResponse) {
    await assignPRToUser(prResponse.number);
  }
})();

/**
 * @helper
 */

interface RequestBody {
  title: string;
  body: string;
  base: string | undefined;
  head: string | undefined;
}
async function createGitHubPR({ requestBody }: { requestBody: RequestBody }) {
  try {
    const response = await fetch(GIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.github+json',
        Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 422) {
      return console.log(`\n🚫 status code : 422. This can happen for the following reasons\n
			1. No issue branch was created for pull request.check your fork repository first\n
			2. your request properties are not valid. check environment variables. (ex. FORK_REPO_OWNER )\n
			3. No change was detected. make change and commit first
			`);
    }

    const data = await response.json();
    const isPrAlreadyExist = data.errors?.[0].message?.includes('A pull request already exists');

    if (isPrAlreadyExist) {
      return console.log('your pr already exist');
    }

    console.log(`your pr is created : ${data.html_url}`);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('fail to create PR');
  }
}

async function assignPRToUser(prNumber: string) {
  try {
    const assignResponse = await fetch(
      `https://api.github.com/repos/${UPSTREAM_REPO_OWNER}/${REPO_NAME}/issues/${prNumber}/assignees`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignees: [FORK_REPO_OWNER] }),
      },
    );

    if (assignResponse.ok) {
      console.log(`✨ Assignee added successfully: ${FORK_REPO_OWNER}`);
    } else {
      const errorData = await assignResponse.json();
      console.error(`\n🚫 Failed to add assignee: ${JSON.stringify(errorData)}`);
    }
  } catch (error: any) {
    console.error(`Error adding assignee: ${error.message}`);
  }
}

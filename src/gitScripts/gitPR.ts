import {
  checkIsRequiredVariablesExist,
  findRemoteAlias,
  getCurrentBranchMetadata,
  getCurrentBranchName,
  getLatestCommitMetadata,
  pushToForkBranch,
  loadEnv,
} from '@/utils';

//PREREQUISITE
loadEnv();

const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const REMOTE_REPO_OWNER = process.env.REMOTE_REPO_OWNER;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH_NAME = process.env.BRANCH_NAME;

const GIT_API_URL = `https://api.github.com/repos/${REMOTE_REPO_OWNER}/${REPO_NAME}/pulls`;

(async () => {
  /**
   * @PRE_SETTINGS
   */

  //0. check variables required first
  const isExistRequiredVars = checkIsRequiredVariablesExist({
    GIT_ACCESS_TOKEN,
    REMOTE_REPO_OWNER,
    FORK_REPO_OWNER,
    REPO_NAME,
    BRANCH_NAME,
  });
  if (!isExistRequiredVars.status) {
    return console.log(
      `🕹 please set the required variables on the ".env.{environment}"\n ${isExistRequiredVars.emptyVariablekeys
        .map((e, i) => `${i + 1}. ${e}`)
        .join('\n')}`,
    );
  }

  //1. get current branch name
  const currentBranchName = getCurrentBranchName();

  //2. push current change log to fork branch
  const forkRemoteAlias = await findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`);
  if (!forkRemoteAlias) {
    return console.log(
      `🕹 No remote for "Fork" branch. please add it first\nRun : \x1b[36mgit remote add fork {fork repository url}\x1b[0m`,
    );
  }

  pushToForkBranch(forkRemoteAlias, currentBranchName);

  /**
   * @CREATE_PR
   */

  const commitMetadata = getLatestCommitMetadata();
  if (commitMetadata === null) {
    return console.log(`🕹 failed to load the latest commit data.`);
  }

  //1. select prefix emoji
  const emoji = getPrefixEmoji(commitMetadata.title);

  //2. generate Body
  const branchMetadata = getCurrentBranchMetadata();
  if (branchMetadata === null) {
    return console.log(`🕹 failed to load the current branch metadata`);
  }

  //3. add close issue trigger to body
  const PRBody = commitMetadata.body + `${commitMetadata.body ? '\n\n' : ''} close #${branchMetadata.issueNumber}`;

  const requestBody = {
    title: `${emoji}${commitMetadata.title}`,
    body: PRBody,
    base: BRANCH_NAME, //pr destination
    head: `${FORK_REPO_OWNER}:${branchMetadata.branchName}`, //pr origin(from)
  };

  //4. create PR
  await createGitHubPR({ requestBody });
})();

/**
 * @helper
 */

function getPrefixEmoji(title: string) {
  let _emoji = '';

  const PREFIX_MAP = {
    'feat:': { emoji: `🌟` },
    'fix:': { emoji: '🔨' },
    'test:': { emoji: '🔬' },
    'refactor:': { emoji: '🏭' },
    'style:': { emoji: '🎨' },
    'docs:': { emoji: '📄' },
    'chore:': { emoji: '💡' },
  };

  for (const [prefix, { emoji }] of Object.entries(PREFIX_MAP)) {
    if (title.includes(prefix)) {
      _emoji = emoji;
      break;
    }
  }

  return _emoji;
}

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
      return console.log(`🚫 status code : 422. This can happen for the following reasons\n
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
  } catch (err) {
    console.error(err);
    throw new Error('fail to create PR');
  }
}

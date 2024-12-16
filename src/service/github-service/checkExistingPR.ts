import { DefaultConfig } from '@/types';
import { highlighted } from '@/constants/colors';
import { PROCESS_EXIT } from '@/utils';
import { GitHubPR, GitHubPRList } from '@/types/github-pull';

export interface CheckExistingParams {
  repoOwner?: string;
  repoName?: string;
  head?: string;
  GIT_ACCESS_TOKEN?: string;
}

export interface CheckExistingPRConfig extends DefaultConfig<any, GitHubPR | null> {}

export default async function checkExistingPR(
  { repoOwner, repoName, head, GIT_ACCESS_TOKEN }: CheckExistingParams,
  checkExistingPRConfig?: CheckExistingPRConfig,
) {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls?head=${(head ?? '').replace(
    /#(?=\d+$)/g,
    '%23',
  )}&state=open`;

  const { onSuccess } = checkExistingPRConfig ?? {};

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const data = await handleGitHubResponse(response);

    if (data) {
      await onSuccess?.(data?.[0]);
    }

    return data;
  } catch (error) {
    handleError({ repoOwner, repoName, head }, error);
  }
}

/**
 * response handler
 */
async function handleGitHubResponse(response: Response) {
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response?.statusText}`);
  }

  const data = (await response.json()) as GitHubPRList;

  return data.length > 0 ? data : null;
}

/**
 * error handler
 */
function handleError({ repoOwner, repoName, head }: CreateCheckExistingPRErrorMessageParams, error: unknown) {
  console.error(
    createCheckExistingPRErrorMessage({
      repoOwner,
      repoName,
      head,
    }),
  );
  PROCESS_EXIT();
}

/**
 * message creators
 */
interface CreateCheckExistingPRErrorMessageParams {
  repoOwner?: string;
  repoName?: string;
  head?: string;
}

function createCheckExistingPRErrorMessage({ repoOwner, repoName, head }: CreateCheckExistingPRErrorMessageParams) {
  return `🚫 Failed to check for existing PR. Please check the following:\n
  1️⃣ Ensure ${highlighted('GIT_ACCESS_TOKEN', ['bold'])} is correctly set.
  2️⃣ Validate environment variables: (repoOwner: ${repoOwner}, repoName: ${repoName}, head: ${head})
  3️⃣ Ensure your branch name follows the correct format(branch name should be in format of ${highlighted(
    '-#issueNumber',
    ['bold'],
  )})
  4️⃣ Check your network connection.
  `;
}

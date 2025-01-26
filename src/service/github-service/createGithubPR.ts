import { highlighted } from '@/constants/colors';
import { PROCESS_EXIT } from '@/utils/common-utils';

export interface PRRequestBody {
  title: string;
  body: string;
  base: string | undefined;
  head: string | undefined;
}

interface CreateGitHubPRParams {
  GIT_API_URL?: string;
  GIT_ACCESS_TOKEN?: string;
  requestBody: PRRequestBody;
  prType: 'origin' | 'fork';
}

export async function createGitHubPR({
  GIT_API_URL = '',
  GIT_ACCESS_TOKEN = '',
  requestBody,
  prType,
}: CreateGitHubPRParams) {
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
      console.error(createGitHubPRRequest422FailureMessage({ prType }));
      PROCESS_EXIT();
    }

    const data = await response.json();
    const isPrAlreadyExist = data.errors?.[0]?.message?.includes('A pull request already exists');

    if (isPrAlreadyExist) {
      console.error(createAlreadyExistPRMessage());
      return null;
    }

    // logging success message and return data
    logSuccessPRMessage({
      prNumber: data?.number,
      url: data?.html_url,
      title: requestBody?.title,
      base: requestBody?.base,
      head: requestBody?.head,
    });

    return data;
  } catch (err) {
    console.error(createUnhandledErrorMessage());
    PROCESS_EXIT();
  }
}

/** logging */
function createUnhandledErrorMessage() {
  return `\n🚫 ${highlighted('Failed to create PR.', ['bold'])} Check your environment variables or network.`;
}

export function createGitHubPRRequest422FailureMessage({ prType }: { prType: CreateGitHubPRParams['prType'] }) {
  const EXAMPLE_ENV_VARIABLE = prType === 'origin' ? 'ORIGIN_REPO_OWNER' : 'FORK_REPO_OWNER';

  return `\n🚫 ${highlighted('Status Code: 422', ['bold'])}. This can happen for the following reasons:\n
  1️⃣  The pull request for this issue branch already exists. Check your ${prType} repository first.\n
  2️⃣  No issue branch was created for pull request. Check your ${prType} repository first.\n
  3️⃣  Your request properties are not valid. Check environment variables (e.g., ${EXAMPLE_ENV_VARIABLE}).\n
  4️⃣  No change was detected. Make changes and commit first. 
      `;
}

export function createAlreadyExistPRMessage() {
  return `\n🔁 ${highlighted('A pull request already exists', ['yellow', 'bold'])}`;
}

export function logSuccessPRMessage({
  prNumber,
  url,
  title,
  base = '',
  head = '',
}: {
  prNumber: number;
  url: string;
  title: string;
  base?: string;
  head?: string;
}) {
  const baseBranch = highlighted(base, ['magenta', 'bold']);
  const headBranch = highlighted(head, ['yellow', 'bold']);
  const prUrl = highlighted(url, ['cyan']);

  console.log(`
${highlighted('✨ Pull Request Created Successfully!', ['green', 'bold'])}
🏷️  ${highlighted('PR Number:', ['bold'])}       ${highlighted(prNumber.toString(), ['yellow'])}
🔗  ${highlighted('URL:', ['bold'])}             ${prUrl}
📄  ${highlighted('Title:', ['bold'])}           ${highlighted(title, ['yellow'])}
🌿  ${highlighted('Base Branch:', ['bold'])}     ${baseBranch}
🌱  ${highlighted('Head Branch:', ['bold'])}     ${headBranch}
`);
}

import { highlighted } from '@/constants/colors';
import { PROCESS_EXIT } from '../common-utils';

interface AssignPRToUserParams {
  prNumber: string;
  UPSTREAM_REPO_OWNER?: string;
  FORK_REPO_OWNER?: string;
  REPO_NAME?: string;
  GIT_ACCESS_TOKEN?: string;
}

export async function assignPRToUser({
  prNumber,
  UPSTREAM_REPO_OWNER = '',
  FORK_REPO_OWNER = '',
  REPO_NAME = '',
  GIT_ACCESS_TOKEN = '',
}: AssignPRToUserParams) {
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
      console.log(createAssignPRToUserSuccessMessage({ assignee: FORK_REPO_OWNER }));
    } else {
      const errorData = await assignResponse.json();
      console.error(createAssignPRToUserErrorMessage(errorData));
    }
  } catch (error: any) {
    console.error(`Error adding assignee: ${error.message}`);
    PROCESS_EXIT();
  }
}

export function createAssignPRToUserSuccessMessage({ assignee }: { assignee: string }) {
  return `✨ Assignee added successfully: ${highlighted(assignee ?? '', ['cyan', 'bold'])}`;
}

export function createAssignPRToUserErrorMessage(errorData: any) {
  return `\n🚫 Failed to add assignee: ${JSON.stringify(errorData)}`;
}

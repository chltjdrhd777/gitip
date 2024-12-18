import { highlighted } from '@/constants/colors';
import { PROCESS_EXIT } from '@/utils/common-utils';

interface AssignPRToUserParams {
  prNumber: string;
  REPO_OWNER?: string;
  ASSIGNEE?: string;
  REPO_NAME?: string;
  GIT_ACCESS_TOKEN?: string;
}

export async function assignPRToUser({
  prNumber,
  REPO_OWNER = '',
  ASSIGNEE = '',
  REPO_NAME = '',
  GIT_ACCESS_TOKEN = '',
}: AssignPRToUserParams) {
  try {
    const assignResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${prNumber}/assignees`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignees: [ASSIGNEE ?? REPO_OWNER] }),
      },
    );

    if (assignResponse.ok) {
      console.log(createAssignPRToUserSuccessMessage({ assignee: ASSIGNEE ?? REPO_OWNER }));
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

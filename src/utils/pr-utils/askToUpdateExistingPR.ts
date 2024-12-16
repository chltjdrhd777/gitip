import select from '@inquirer/select';
import { PROCESS_EXIT } from '../common-utils';
import { highlighted } from '@/constants/colors';

interface AskToUpdateExistingPRParams {
  branchName: string;
  prUrl: string;
  onConfirm?: (...ars: any) => any;
  onCancel?: (...args: any) => any;
}

const ANSWER_ENUM = {
  YES: 'yes',
  NO: 'no',
};

export async function askToUpdateExistingPR(askToUpdateExistingPRParams: AskToUpdateExistingPRParams) {
  const { branchName, prUrl, onConfirm, onCancel } = askToUpdateExistingPRParams ?? {};

  try {
    const userChoice = await select({
      message: `
      🔔 ${highlighted('Pull Request Notice:', ['bold', 'magenta'])}
      A pull request already exists for the branch ${highlighted(branchName, ['cyan', 'bold'])}.
      
      🔗 ${highlighted('PR URL:', ['green', 'bold'])} ${prUrl}
      
      ❓ ${highlighted('Next Steps:', ['yellow', 'bold'])}
      Would you like to update the existing PR with your latest changes?
      
      💡 ${highlighted('Tip:', ['bold', 'magenta'])}
      If your changes are ${highlighted('contextually different', ['cyan'])} from the current PR, 
      consider creating a ${highlighted('new PR', ['green', 'bold'])} to ensure better tracking
      `,

      choices: [
        {
          name: '✅ Yes, proceed with PR update',
          value: ANSWER_ENUM.YES,
        },
        {
          name: '🛑 No, cancel the process',
          value: ANSWER_ENUM.NO,
        },
      ],
    });

    if (userChoice === ANSWER_ENUM.YES) {
      console.log('\n✅ Proceeding with PR update...');
      await onConfirm?.();
    } else {
      console.log('\n🛑 Canceling PR update. Exiting...');
      await onCancel?.();
    }
  } catch (error: any) {
    PROCESS_EXIT();
  } finally {
    PROCESS_EXIT();
  }
}

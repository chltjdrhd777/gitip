const { Select } = require('enquirer');

import { ColorCode } from '@/constants/colors';
import { PROCESS_EXIT } from '@/utils';

export async function confirmToDeleteBranches() {
  const warningMessage = `\n⚠️ ${ColorCode.yellow(
    'NOTICE',
  )}: This will delete the issue branches permanently.\nMake sure you have a backup of your branches before proceeding.\n
(It there are any unmerged issue branch, please merge first)  
    `;

  console.log(warningMessage);

  try {
    const confirmChoice = `${ColorCode.green('[Yes]')} Delete branches`;
    const abortChoice = `${ColorCode.red('[No]')} Abort`;
    const choices = [confirmChoice, abortChoice];

    const choice = await new Select({
      message: 'Choose an action to perform:',
      choices,
    }).run();

    console.log('choice', choice);

    if (choice === abortChoice) {
      PROCESS_EXIT();
    }
  } catch {}
}

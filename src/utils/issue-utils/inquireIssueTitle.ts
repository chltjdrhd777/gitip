import { input } from '@inquirer/prompts';

export async function inquireIssueTitle() {
  const title = await input({
    message: 'Enter issue title:',
    validate: (value) => {
      if (!value) return 'please enter the title';
      return true;
    },
  });

  return title;
}

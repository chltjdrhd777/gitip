import { input } from '@inquirer/prompts';

interface InquirePRTitleParams {
  defaultValue?: string;
}

export async function inquirePRTitle({ defaultValue }: InquirePRTitleParams = {}) {
  const mergeText = 'Merge branch';

  const title = await input({
    message: 'Enter PR Title (default: latest commit title):',
    default: !defaultValue?.includes(mergeText) ? defaultValue : undefined,
    validate: (value: string) => {
      if (!value) {
        return 'Please enter a PR title';
      }

      return true;
    },
  });

  return title;
}

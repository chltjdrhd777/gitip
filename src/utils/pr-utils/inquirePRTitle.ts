import { input } from '@inquirer/prompts';

interface InquirePRTitleParams {
  defaultValue?: string;
}

export async function inquirePRTitle({ defaultValue }: InquirePRTitleParams = {}) {
  const title = await input({
    message: 'Enter PR Title (default: latest commit title):',
    default: defaultValue,
  });

  return title;
}

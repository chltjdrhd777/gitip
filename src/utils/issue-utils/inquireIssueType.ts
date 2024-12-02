import { DEFAULT_ISSUE_TEMPLATES } from '@/constants/defaultIssueTemplates';

import path from 'path';
import { readdirSync } from 'fs';
import select from '@inquirer/select';

export function readTemplateDirectory() {
  try {
    const templateFolderPath = './.github/ISSUE_TEMPLATE';
    const templates = readdirSync(path.join(process.cwd(), templateFolderPath));

    return templates.map((templateFileName) => ({
      name: templateFileName,
      value: templateFileName,
    }));
  } catch {
    return null;
  }
}

export async function inquireIssueType() {
  let choices = [];

  const templates = readTemplateDirectory();

  if (templates === null || templates.length === 0) {
    choices = DEFAULT_ISSUE_TEMPLATES;
  } else {
    choices = templates;
  }

  const answer = await select({
    message: 'what type of issue you want to create:',
    choices,
  });

  return answer;
}

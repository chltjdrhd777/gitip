import path from 'path';
import { readdirSync } from 'fs';

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

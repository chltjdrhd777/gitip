import { readFileSync } from 'fs';

export function getIssueTemplate(url: string) {
  try {
    const templateContent = readFileSync(url, 'utf8');
    return templateContent;
  } catch (error) {
    return null;
  }
}

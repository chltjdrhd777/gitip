function createDefaultIssueTemplates(templateNames: string[]): { name: string; value: string }[] {
  return templateNames.map((name) => ({ name, value: name }));
}

const templateNames = [
  'feature',
  'fix',
  'bug',
  'test',
  'chore',
  'docs',
  'refactor',
  'style',
  'perf',
  'ci',
  'build',
  'revert',
  'deps',
];

export const DEFAULT_ISSUE_TEMPLATES = createDefaultIssueTemplates(templateNames);

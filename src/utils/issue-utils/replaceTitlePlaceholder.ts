export function replaceTitlePlaceholder(
  issueTemplate: string | null,
  issueTitle: string,
  TEMPLATE_TITLE_PLACEHOLDER?: string,
) {
  if (!issueTemplate) return null;

  if (TEMPLATE_TITLE_PLACEHOLDER) {
    issueTemplate = issueTemplate.replace(TEMPLATE_TITLE_PLACEHOLDER, issueTitle);
  }
  return issueTemplate;
}

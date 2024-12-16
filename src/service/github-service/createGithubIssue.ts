import { COLORS } from '@/constants/colors';

interface CreateGitHubIssue {
  issueTemplate: string | null;
  issueTitle: string;
  TEMPLATE_TITLE_PLACEHOLDER?: string;
  TARGET_REPO_OWNER?: string;
  GIT_API_URL: string;
  GIT_ACCESS_TOKEN?: string;
}

export async function createGitHubIssue(createGitHubIssue: CreateGitHubIssue) {
  const { issueTemplate, issueTitle, TEMPLATE_TITLE_PLACEHOLDER, TARGET_REPO_OWNER, GIT_API_URL, GIT_ACCESS_TOKEN } =
    createGitHubIssue;

  // default body
  let requestBody: { [key: string]: string } = { title: issueTitle };

  if (issueTemplate && TEMPLATE_TITLE_PLACEHOLDER) {
    // separate markdown
    const hyphenSplittedGroup = String(issueTemplate)
      .split('---')
      .map((section) => section.trim());

    // extract metadata
    const templateMetadata = hyphenSplittedGroup[1].split('\n').reduce((acc, cur) => {
      const [key, value] = cur.split(/:(.+)/, 2);

      if (key === 'assignees') {
        acc[key] = [TARGET_REPO_OWNER];
        return acc;
      }

      const arrayValueKey = ['labels']; // a key list that requires array value

      acc[key] = arrayValueKey.includes(key)
        ? value.split(',').map((e) => e.trim())
        : unescapeUnicode(value.trim().replace(/^"|"$/g, '')); // change emoji unicode to hexadecimal

      return acc;
    }, {} as { [key: string]: any });

    const templateBody = hyphenSplittedGroup[2] ?? '';

    // update requestBody
    requestBody = { ...templateMetadata, body: templateBody };
  }

  try {
    const response = await fetch(GIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 422) {
      return console.log(`\n🚫 status code : 422. This can happen for the following reasons\n
			1. No issue branch was created for pull request(or closed by cib cli). check your fork repository first\n
			2. your request properties are not valid. check environment variables. (ex. FORK_REPO_OWNER )\n
			3. No change was detected. make change and commit first
			`);
    }

    if (response.status !== 201) {
      console.log('\n🚫 Failed to receive success response, please check your env', response);
      return false;
    } else {
      const data = (await response.json()) as any;

      const { bold, reset, cyan, green, yellow, magenta } = COLORS;

      const baseBranch = magenta + (data.base || 'develop') + reset;
      const headBranch = yellow + (data.head || 'feature/my-feature') + reset;

      console.log(`
${green}${bold}✨ Issue Created Successfully!${reset}
🏷️  ${bold}Issue Number:${reset}  ${yellow}${data.number}${reset}
🔗  ${bold}URL:${reset}           ${cyan}${data.html_url}${reset}
📄  ${bold}Title:${reset}         ${yellow}${issueTitle}${reset}
🌿  ${bold}Base Branch:${reset}   ${baseBranch}
🌱  ${bold}Head Branch:${reset}   ${headBranch}
`);

      return {
        issueNumber: data?.number,
        issueURL: data?.html_url,
      };
    }
  } catch (err) {
    console.error(err);
    throw new Error('\n🚫 Failed to create issue, check your env again');
  }
}

function unescapeUnicode(str: string) {
  const unicodeRegex = /\\[uU]([0-9a-fA-F]{4,8})/g;
  const matched = str.match(unicodeRegex);

  if (!matched) return str;

  return str.replace(unicodeRegex, (_, group) => String.fromCodePoint(parseInt(group, 16)));
}

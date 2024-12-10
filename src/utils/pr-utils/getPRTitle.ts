interface GetPRTitleParams {
  emoji: string;
  titleFromCommit: string;
}

export function getPRTitle({ emoji, titleFromCommit }: GetPRTitleParams) {
  return `${emoji}${titleFromCommit}`;
}

import { ColorCode } from '@/constants/colors';
import { input } from '@inquirer/prompts';

// RegExp
const Space = /\s+/g;
const SpecialCharacter = /[^a-zA-Z0-9\-\/.]/g;
const MultipleDash = /-{2,}/g;
const MultipleSlash = /\/{2,}/g;
const ValidStartEnd = /^[-.\/_]+|[-.\/_]+$/g;

export async function inquireIssueBranchName() {
  let branchName = '';

  await input({
    message: 'Enter issue branch name to checkout (default: issue):',
    default: 'issue',
    validate: (value) => {
      let isExceptionalCase = false;
      const trimmed = value.trim();

      // Validate raw input
      if (!trimmed) {
        console.log(`${ColorCode.red('[NO BRANCH INPUT]')} Please enter a branch name.`);
        return false;
      }

      if (trimmed.length > 100) {
        console.log(`${ColorCode.red('[TOO LONG INPUT]')} a branch name should be less than 100 characters.`);
        return false;
      }

      // Feedback on raw input
      if (ValidStartEnd.test(trimmed)) {
        isExceptionalCase = true;

        console.log(`${ColorCode.yellow('[INVALID START OR END]')} Invalid start or end characters will be removed.`);
      }
      if (SpecialCharacter.test(trimmed)) {
        isExceptionalCase = true;

        console.log(`${ColorCode.yellow('[NO SPECIAL CHARACTERS]')} Special characters will be removed.`);
      }
      if (Space.test(trimmed)) {
        isExceptionalCase = true;

        console.log(`${ColorCode.yellow('[SPACES]')} Spaces will be replaced with "-".`);
      }
      if (MultipleDash.test(trimmed)) {
        isExceptionalCase = true;

        console.log(`${ColorCode.yellow('[MULTIPLE DASHES]')} Multiple dashes will be replaced with a single "-".`);
      }
      if (MultipleSlash.test(trimmed)) {
        isExceptionalCase = true;

        console.log(`${ColorCode.yellow('[MULTIPLE SLASHES]')} Multiple slashes will be replaced with a single "/".`);
      }

      // Process title
      if (isExceptionalCase) {
        const processedBranchName = getProcessedBranchName(trimmed);

        branchName = processedBranchName;
      } else {
        branchName = trimmed;
      }

      return true;
    },
  });

  return branchName;
}

function getProcessedBranchName(title: string): string {
  return title
    .trim()
    .toLocaleLowerCase()
    .replace(ValidStartEnd, '') // Remove invalid start or end characters
    .replace(SpecialCharacter, '') // Remove special characters
    .replace(Space, '-') // Replace spaces with "-"
    .replace(MultipleDash, '-') // Replace multiple dashes with a single dash
    .replace(MultipleSlash, '/'); // Replace multiple slashes with a single slash
}

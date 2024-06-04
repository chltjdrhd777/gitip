import { executeCommand } from './executeCommand';

export default function getLatestCommitMetadata() {
  const commit = executeCommand('git log --format=%s%n%b -n 1')?.toString();

  if (commit) {
    const [title, ...bodyArray] = commit.split('\n');
    const body = bodyArray.filter((e) => e !== '').join('\n');

    return { title, body };
  }

  return null;

  //   return new Promise((resolve) => {
  //     //%s = commit message title
  //     //%n = new line
  //     //%b = commit message body
  //     exec('git log --format=%s%n%b -n 1', (error, stdout, stderr) => {
  //       if (error || stderr) {
  //         throw new Error('fail to read a latest commit message');
  //       }

  //       // get title and body separately
  //       const [title, ...bodyArray] = stdout.split('\n');
  //       const body = bodyArray.filter((e) => e !== '').join('\n');

  //       resolve({ title, body });
  //     });
  //   });
}

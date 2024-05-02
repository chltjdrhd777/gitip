import { SingleBar } from 'cli-progress';
import { exec } from 'child_process';

export default async function installGithubCLI() {
  return new Promise((resolve, reject) => {
    console.log('⚙️  gh is not installed, please wait for the installation');

    const progressBar = new SingleBar({
      format: '{bar} {percentage}% | ETA: {eta}s | {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    });

    progressBar.start(100, 0);
    let progressStep = 0;

    const brewInstallProcess = exec('brew install gh');

    brewInstallProcess.stdout!.on('data', () => {
      progressStep += 1;
      progressBar.update(progressStep * 20);
    });

    brewInstallProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('\nSuccess to install gh');
        resolve(true);
      } else {
        console.error('Failed to install gh. Please check brew');
        reject(null);
      }
      progressBar.stop();
    });
  });
}

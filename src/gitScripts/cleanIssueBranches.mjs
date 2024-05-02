import { exec } from 'child_process';
import ora from 'ora';

// this process will clean all redundant issue branches from local to remote
(async () => {
	const spinner = ora('please wait for cleaning').start();

	//0. branch remote update and checkout
	await executeCommand('git fetch --prune origin');
	await executeCommand('git checkout feature');

	//1. delete all remote issue branches
	const getAllOriginIssueBranches = await executeCommand(`git branch -r | grep 'origin/issue-'`);
	const refinedBranchNames = getAllOriginIssueBranches
		.split('\n')
		.filter(e => !!e)
		.map(e => e.trim().replace(/origin\//, ''));

	refinedBranchNames.forEach(async issueName => {
		await executeCommand(`git push origin --delete ${issueName}`);
	});

	//2. delete all local issue branches
	await executeCommand("git branch | grep 'issue-' | xargs git branch -D");

	//3. fetch latest feature branch
	await executeCommand('git fetch --prune origin');

	spinner.stop();
	console.log('🧽 done');
})();

/**
 *
 * @helpers
 */

async function executeCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error | stderr) {
				console.error(err | stderr);
				reject(null);
			}

			resolve(stdout);
		});
	});
}

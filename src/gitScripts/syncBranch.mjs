import dotenv from 'dotenv';
dotenv.config();

import inquirer from 'inquirer';
import { exec } from 'child_process';

import ora from 'ora';

//PREREQUISITE
const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;
const REPO_NAME = 'ems-admin';

(async () => {
	const isExistRequiredVars = checkIsRequiredVariablesExist();
	if (!isExistRequiredVars.status) {
		return console.log(
			`🕹 please set the required variables on the ".env"\n ${isExistRequiredVars.emptyVariablekeys.map((e, i) => `${i + 1}. ${e}`).join('\n')}`,
		);
	}

	const isGithubCLIExist = await checkGithubCLI();
	if (!isGithubCLIExist) {
		return console.error(
			'🕹 you have no github CLI... please install and login first : \n1. brew install gh\n2. gh auth login',
		);
	}

	const targetBranch = await askTargetBranchToSync();

	const spinner = ora('please wait for updating').start();
	await syncForkBranchAndPullLocalBranch(targetBranch);

	spinner.stop();
	console.log('✅ done');
})();

/**
 * @helpers
 */

function checkIsRequiredVariablesExist() {
	const requiredVariables = { GIT_ACCESS_TOKEN, FORK_REPO_OWNER };

	return Object.entries(requiredVariables).reduce(
		(acc, [key, value]) => {
			if (!value) {
				acc.status = false;
				acc.emptyVariablekeys.push(key);
			}
			return acc;
		},
		{ status: true, emptyVariablekeys: [] },
	);
}

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

export async function getBranchList() {
	return await executeCommand('git branch --list');
}
async function askTargetBranchToSync() {
	const branchList = await getBranchList();
	const refined = branchList
		.trim()
		.split('\n')
		.map(branch => branch.replace(/\*/, '').trim());

	const { branchName } = await inquirer.prompt([
		{
			type: 'list',
			name: 'branchName',
			message: 'what fork branch do you want to sync',
			choices: refined,
		},
	]);

	return branchName;
}

async function checkGithubCLI() {
	return executeCommand('gh --version');
}

async function findRemoteAlias(targetString) {
	const remoteAlias = await executeCommand(
		`git remote -v | grep '${targetString}' | awk '{print $1}'`,
	);

	return remoteAlias.split(/\n/)[0];
}
async function syncForkBranchAndPullLocalBranch(targetBranch) {
	const forkRepoPath = `${FORK_REPO_OWNER}/${REPO_NAME}`;

	await executeCommand(`gh repo sync ${forkRepoPath} -b ${targetBranch}`);
	await executeCommand(
		`git checkout ${targetBranch} && git pull ${await findRemoteAlias(forkRepoPath)} ${targetBranch}`,
	);
}

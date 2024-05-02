import { exec } from 'child_process';
import fetch from 'node-fetch';

import dotenv from 'dotenv';
dotenv.config();

//PREREQUISITE
const GIT_ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN;
const FORK_REPO_OWNER = process.env.FORK_REPO_OWNER;

const PR_BASE = 'feature';
const REMOTE_REPO_OWNER = 'reable-dev';
const REPO_NAME = 'ems-admin';
const GIT_API_URL = `https://api.github.com/repos/${REMOTE_REPO_OWNER}/${REPO_NAME}/pulls`;

(async () => {
	/**
	 * @PRE_SETTINGS
	 */

	//0. check variables required first
	const isExistRequiredVars = checkIsRequiredVariablesExist();
	if (!isExistRequiredVars.status) {
		return console.log(
			`🕹 please set the required variables on the ".env"\n ${isExistRequiredVars.emptyVariablekeys.map((e, i) => `${i + 1}. ${e}`).join('\n')}`,
		);
	}

	//1. get current branch name
	const currentBranchName = await getCurrentBranchName();

	//2. push current change log to fork branch
	const forkRemoteAlias = await findRemoteAlias(`${FORK_REPO_OWNER}/${REPO_NAME}`);
	if (!forkRemoteAlias) {
		return console.log(
			`🕹 No remote for "Fork" branch. please add it first\nRun : \x1b[36mgit remote add fork {fork repository url}\x1b[0m`,
		);
	}

	await pushToForkBranch(forkRemoteAlias, currentBranchName);

	/**
	 * @CREATE_PR
	 */

	const { title, body } = await getLatestCommitMetadata();

	//1. select prefix emoji
	const emoji = getPrefixEmoji(title);

	//2. generate Body
	const { branchName, issueNumber } = await getCurrentBranchMetadata();

	//3. add close issue trigger to body
	const PRBody = body + `${body ? '\n\n' : ''} close #${issueNumber}`;

	const requestBody = {
		title: `${emoji}${title}`,
		body: PRBody,
		base: PR_BASE, //pr destination
		head: `${FORK_REPO_OWNER}:${branchName}`, //pr origin(from)
	};

	//4. create PR
	await createGitHubPR({ requestBody });
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

async function getCurrentBranchName() {
	return await executeCommand('git rev-parse --abbrev-ref HEAD');
}

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

async function findRemoteAlias(targetString) {
	const remoteAlias = await executeCommand(
		`git remote -v | grep '${targetString}' | awk '{print $1}'`,
	);

	return remoteAlias.split(/\n/)[0];
}

async function pushToForkBranch(forkRemoteAlias, currentBranchName) {
	return await executeCommand(`git push ${forkRemoteAlias} ${currentBranchName}`);
}

async function getCurrentBranchMetadata() {
	return new Promise(resolve => {
		exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
			if (error || stderr) {
				throw new Error('fail to read a latest commit message');
			}

			// extract issue number from the branch name
			const issueNumber = stdout.match(/issue-(.*)/)?.[1];

			if (!issueNumber) {
				throw new Error(
					'fail to read a issue number from your current branch\nthe branch name must includes "issue-"',
				);
			}

			resolve({
				branchName: stdout.replace(/\n$/g, ''),
				issueNumber,
			});
		});
	});
}

async function getLatestCommitMetadata() {
	return new Promise(resolve => {
		//%s = commit message title
		//%n = new line
		//%b = commit message body
		exec('git log --format=%s%n%b -n 1', (error, stdout, stderr) => {
			if (error || stderr) {
				throw new Error('fail to read a latest commit message');
			}

			// get title and body separately
			const [title, ...bodyArray] = stdout.split('\n');
			const body = bodyArray.filter(e => e !== '').join('\n');

			resolve({ title, body });
		});
	});
}

function getPrefixEmoji(title) {
	let _emoji = '';

	const PREFIX_MAP = {
		'feat:': { emoji: `🌟` },
		'fix:': { emoji: '🔨' },
		'test:': { emoji: '🔬' },
	};

	for (const [prefix, { emoji }] of Object.entries(PREFIX_MAP)) {
		if (title.includes(prefix)) {
			_emoji = emoji;
			break;
		}
	}

	return _emoji;
}

async function createGitHubPR({ requestBody }) {
	try {
		const response = await fetch(GIT_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.github+json',
				Authorization: `Bearer ${GIT_ACCESS_TOKEN}`,
			},
			body: JSON.stringify(requestBody),
		});

		if (response.status === 422) {
			return console.log(`🚫 status code : 422. This can happen for the following reasons\n
			1. No issue branch was created for pull request.check your fork repository first\n
			2. your request properties are not valid. check environment variables. (ex. FORK_REPO_OWNER )\n
			3. No change was detected. commit first
			`);
		}

		const data = await response.json();
		const isPrAlreadyExist = data.errors?.[0].message?.includes('A pull request already exists');

		if (isPrAlreadyExist) {
			return console.log('your pr already exist');
		}

		console.log(`your pr is created : ${data.html_url}`);
	} catch (err) {
		console.error(err);
		throw new Error('fail to create PR');
	}
}

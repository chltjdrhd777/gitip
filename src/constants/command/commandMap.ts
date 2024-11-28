import { Command } from './Command';
import { CommandStore } from './CommandStore';

/** fork repo command store */
const forkRepoCommandStore = new CommandStore().addCommands([
  new Command('create an issue', './gitScripts/forkScripts/gitIssue.js'),
  new Command('create a pull request', './gitScripts/forkScripts/gitPR.js'),
  new Command('synchronize a fork branch with a remote branch', './gitScripts/forkScripts/syncBranch.js'),
  new Command('clean redundant issue branches', './gitScripts/forkScripts/cleanIssueBranches.js'),
]);

/** origin repo command store */
const originRepoCommandStore = new CommandStore().addCommands([
  new Command('create an issue', './gitScripts/originScripts/gitIssue.js'),
]);

export { forkRepoCommandStore, originRepoCommandStore };

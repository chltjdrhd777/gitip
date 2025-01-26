import { ColorCode } from '../colors';
import { Command } from './Command';
import { CommandStore } from './CommandStore';

const { white } = ColorCode;

/** fork repo command store */
const forkRepoCommandStore = new CommandStore().addCommands([
  new Command(`${white('[issue]')} create an issue`, './gitScripts/forkScripts/gitIssue.js'),
  new Command(`${white('[pr]')} create a pull request`, './gitScripts/forkScripts/gitPR.js'),
  new Command(
    `${white('[sync]')} synchronize a fork branch with a remote branch`,
    './gitScripts/forkScripts/syncBranch.js',
  ),
  new Command(`${white('[clean]')} clean issue branches`, './gitScripts/forkScripts/cleanIssueBranches.js'),
]);

/** origin repo command store */
const originRepoCommandStore = new CommandStore().addCommands([
  new Command(`${white('[issue]')} create an issue`, './gitScripts/originScripts/gitIssue.js'),
  new Command(`${white('[pr]')} create a pull request`, './gitScripts/originScripts/gitPR.js'),
  new Command(`${white('[clean]')} clean issue branches`, './gitScripts/originScripts/cleanIssueBranches.js'),
]);

export { forkRepoCommandStore, originRepoCommandStore };

import { ColorCode } from '../colors';
import { Command } from './Command';
import { CommandStore } from './CommandStore';

const { green } = ColorCode;

/** fork repo command store */
const forkRepoCommandStore = new CommandStore().addCommands([
  new Command(`${green('[issue]')} create an issue`, './gitScripts/forkScripts/gitIssue.js'),
  new Command(`${green('[pr]')} create a pull request`, './gitScripts/forkScripts/gitPR.js'),
  new Command(
    `${green('[sync]')} synchronize a fork branch with a remote branch`,
    './gitScripts/forkScripts/syncBranch.js',
  ),
  new Command(`${green('[clean]')} clean issue branches`, './gitScripts/forkScripts/cleanIssueBranches.js'),
]);

/** origin repo command store */
const originRepoCommandStore = new CommandStore().addCommands([
  new Command(`${green('[issue]')} create an issue`, './gitScripts/originScripts/gitIssue.js'),
  new Command(`${green('[pr]')} create a pull request`, './gitScripts/originScripts/gitPR.js'),
  new Command(`${green('[clean]')} clean issue branches`, './gitScripts/originScripts/cleanIssueBranches.js'),
]);

export { forkRepoCommandStore, originRepoCommandStore };

import { isNullish } from '@/utils/common-utils/isNullish';
import { Command } from './Command';
import { GitipCommandType } from '@/types';

export class CommandStore<N extends string = string> {
  private commands: Map<N, string>;

  constructor() {
    this.commands = new Map();
  }

  /** 커맨드 등록 */
  addCommand(command: Command): void {
    if (this.commands.has(command.name as N)) {
      console.error(`Command with name "${command.name}" already exists.`);
    }
    this.commands.set(command.name as N, command.scriptSource);
  }

  /** 커맨드 배치 등록 */
  addCommands(commands: Command[]) {
    commands.forEach((command) => this.addCommand(command));
    return this;
  }

  /** 커맨드 이름 리스트 getter */
  getAllCommandNames(): N[] {
    return Array.from(this.commands.keys());
  }

  /** 특정 커맨드 스크립트 source getter */
  getScriptSource(name: N): string | undefined {
    return this.commands.get(name);
  }

  /** commandType에 따른 특정 스크립트 source getter */
  getScriptSourceByCommandType(commandType?: GitipCommandType): string | undefined {
    const allCommandNames = this.getAllCommandNames();

    const targetCommandName = allCommandNames.find((commandName) => commandName.includes(`[${commandType}]`)) as N;

    return this.getScriptSource(targetCommandName);
  }

  /** 커맨드 삭제 */
  removeCommand(name: N): boolean {
    return this.commands.delete(name);
  }

  /** 특정 커맨드 조합으로 이루어진 store 복제 리턴 메서드  */
  getClonedCommandStore<T extends N[]>(commandNames: T): CommandStore<T[number]> {
    const filteredCommands = commandNames
      .map((name) => {
        const scriptSource = this.commands.get(name);
        return scriptSource ? new Command(name, scriptSource) : null;
      })
      .filter((command): command is Command<N> => !isNullish(command));

    const clonedCommandStore = new CommandStore<T[number]>();
    clonedCommandStore.addCommands(filteredCommands);
    return clonedCommandStore;
  }
}

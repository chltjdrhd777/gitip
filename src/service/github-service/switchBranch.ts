import { DefaultConfig } from '@/types';
import { executeCommand } from '@/utils';

type Flag = string;

interface SwitchBranchParams {
  branchName?: string;
  flags?: Flag[] | Array<[Flag, boolean]>;
}

interface SwitchBranchConfig extends DefaultConfig {}

export default function switchBranch(switchBranchParams: SwitchBranchParams, switchBranchConfig?: SwitchBranchConfig) {
  const { branchName, flags = [] } = switchBranchParams;

  const _flags = flags.filter((flag): flag is string | [string, true] => {
    if (typeof flag === 'string' && flag.trim() !== '') return true;
    if (Array.isArray(flag)) {
      const [, condition] = flag;
      return condition === true;
    }
    return false;
  });

  return executeCommand(`git switch ${_flags.join(' ')} ${branchName}`, switchBranchConfig);
}

export function createSwitchBranchErrorMessage({ branchName }: { branchName?: string }) {
  return `\n🚫 Failed to switch branch: ${branchName}. check your local branch list first`;
}
export function createSwitchBranchSuccessMessage({ branchName }: { branchName?: string }) {
  return `\n✅ switched branch: ${branchName}`;
}

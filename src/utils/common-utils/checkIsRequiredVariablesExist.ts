import { Callbacks } from '@/types';
import { PROCESS_EXIT } from './PROCESS_EXIT';

interface Variables {
  status: boolean;
  emptyVariableKeys: string[];
}

interface CheckIsRequiredVariablesExistConfig extends Callbacks<Variables> {}

export function checkIsRequiredVariablesExist(
  requiredVariables: { [key: string]: string | undefined },
  checkIsRequiredVariablesExistConfig?: CheckIsRequiredVariablesExistConfig,
) {
  const variables = Object.entries(requiredVariables).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc.status = false;
        acc.emptyVariableKeys.push(key);
      }
      return acc;
    },
    { status: true, emptyVariableKeys: [] as string[] },
  );

  if (variables.status === false) {
    checkIsRequiredVariablesExistConfig?.onError?.(variables);
    PROCESS_EXIT();
  }

  return variables;
}

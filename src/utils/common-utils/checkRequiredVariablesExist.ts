import { Callbacks } from '@/types';
import { PROCESS_EXIT } from './PROCESS_EXIT';

interface Variables {
  status: boolean;
  emptyVariableKeys: string[];
}

interface CheckRequiredVariablesExistConfig extends Callbacks<Variables> {}

export function checkRequiredVariablesExist(
  requiredVariables: { [key: string]: string | undefined },
  checkRequiredVariablesExistConfig?: CheckRequiredVariablesExistConfig,
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
    checkRequiredVariablesExistConfig?.onError?.(variables);
    PROCESS_EXIT();
  }

  return variables;
}

export function createCheckRequiredVariablesExistErrorMessage({ variables }: { variables?: Variables }) {
  return `🕹 please set the required variables on the ".env.{environment}"\n${(variables?.emptyVariableKeys ?? [])
    .map((e, i) => `${i + 1}. ${e}`)
    .join('\n')}\n\n🕹  If variables already exist, please run this command from the root folder of your project`;
}

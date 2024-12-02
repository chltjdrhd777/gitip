export function checkIsRequiredVariablesExist(requiredVariables: { [key: string]: string | undefined }) {
  return Object.entries(requiredVariables).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc.status = false;
        acc.emptyVariableKeys.push(key);
      }
      return acc;
    },
    { status: true, emptyVariableKeys: [] as string[] },
  );
}

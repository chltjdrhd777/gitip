export default function checkIsRequiredVariablesExist(requiredVariables: { [key: string]: string | undefined }) {
  return Object.entries(requiredVariables).reduce(
    (acc, [key, value]) => {
      if (!value) {
        acc.status = false;
        acc.emptyVariablekeys.push(key);
      }
      return acc;
    },
    { status: true, emptyVariablekeys: [] as string[] },
  );
}

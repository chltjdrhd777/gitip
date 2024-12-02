export function log(debug?: boolean, logger?: (...args: any) => any) {
  if (debug) {
    logger?.();
  }
}

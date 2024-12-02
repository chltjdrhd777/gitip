export interface Callbacks {
  onSuccess?: (...args: any) => any;
  onError?: (...args: any) => any;
  onSettled?: (...args: any) => any;
}

export interface DefaultConfig {
  debug?: boolean;
}

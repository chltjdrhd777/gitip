export type SpinnerType = 'dots1' | 'dots2' | 'line' | 'arc';
export interface SpinnerMetadata {
  interval: number;
  frames: string[];
}
export type Spinners = {
  [spinner in SpinnerType]: SpinnerMetadata;
};

export interface SpinnerConfig {
  interval?: number;
}

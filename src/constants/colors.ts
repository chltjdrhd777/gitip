const bold = '\x1b[1m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const magenta = '\x1b[35m';
const reset = '\x1b[0m';

export const COLORS = {
  bold,
  reset,
  cyan,
  green,
  yellow,
  magenta,
};

export const highlighted = (text: string, colors: Array<keyof typeof COLORS> = []) => {
  return `${colors?.map((color) => COLORS[color]).join('')}${text}${COLORS.reset}`;
};

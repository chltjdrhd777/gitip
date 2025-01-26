const bold = '\x1b[1m';
const reset = '\x1b[0m';

const black = '\x1b[30m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const white = '\x1b[37m';
const gray = '\x1b[90m';

export const COLORS = {
  bold,
  reset,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
};

export const highlighted = (text: string, colors: Array<keyof typeof COLORS> = []) => {
  return `${colors?.map((color) => COLORS[color]).join('')}${text}${COLORS.reset}`;
};

export class ColorCode {
  static bold = (text: string) => `${COLORS.bold}${text}${COLORS.reset}`;
  static black = (text: string) => `${COLORS.black}${COLORS.bold}${text}${COLORS.reset}`;
  static red = (text: string) => `${COLORS.red}${COLORS.bold}${text}${COLORS.reset}`;
  static green = (text: string) => `${COLORS.green}${COLORS.bold}${text}${COLORS.reset}`;
  static yellow = (text: string) => `${COLORS.yellow}${COLORS.bold}${text}${COLORS.reset}`;
  static blue = (text: string) => `${COLORS.blue}${COLORS.bold}${text}${COLORS.reset}`;
  static magenta = (text: string) => `${COLORS.magenta}${COLORS.bold}${text}${COLORS.reset}`;
  static cyan = (text: string) => `${COLORS.cyan}${COLORS.bold}${text}${COLORS.reset}`;
  static white = (text: string) => `${COLORS.white}${COLORS.bold}${text}${COLORS.reset}`;
  static gray = (text: string) => `${COLORS.gray}${COLORS.bold}${text}${COLORS.reset}`;
}

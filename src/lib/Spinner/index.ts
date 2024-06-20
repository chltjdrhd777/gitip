import fs from 'fs';
import rl from 'readline';
import process, { stdin } from 'process';
import { SpinnerConfig, SpinnerType, Spinners } from './types';
import path from 'path';

const stdout = process.stdout;
const spinnerJsonPath = path.resolve(__dirname, './spinners.json').toString();
const spinners: Spinners = JSON.parse(fs.readFileSync(spinnerJsonPath).toString());

const hideCursorANSI = '\x1B[?25l';
const showCursorANSI = '\x1B[?25h';
const currentCursorANSI = '\x1B[6n';

export class Spinner {
  constructor(private comment: string = '') {}

  async spin(spinnerType: SpinnerType, config: SpinnerConfig = {}) {
    try {
      this.cursorControl('hide');

      const [row] = await this.getCursorDimension();
      const { interval: baseInterval, frames } = spinners[spinnerType];

      const printSpinerParams = {
        frameIdx: 0,
        row,
        frames,
      };

      const intervalId = setInterval(() => {
        this.printSpiner(printSpinerParams);
      }, config.interval ?? baseInterval);

      this.cleanup(intervalId);

      return {
        stop: () => clearInterval(intervalId),
      };
    } catch {
      process.exit();
    }
  }

  async getCursorDimension(): Promise<[number, number]> {
    return new Promise((resolve) => {
      const onData = (data: Buffer) => {
        // currentCursorANSI result is like "^[[13;1R"
        const match = /\[(\d+);(\d+)R/.exec(data.toString());

        if (match) {
          stdin.off('data', onData);
          stdin.setRawMode(false);
          stdin.pause();
          const [, row, col] = match;
          resolve([Math.max(parseInt(row, 10) - 1, 0), parseInt(col, 10)]);
        }
      };

      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf-8');
      stdin.once('data', onData);

      stdout.write(currentCursorANSI);
    });
  }

  printSpiner(printSpinerParams: { frameIdx: number; row: number; frames: string[] }) {
    const { frames, row } = printSpinerParams;
    stdout.write(`${frames[printSpinerParams.frameIdx]} ${this.comment}`);
    printSpinerParams.frameIdx = (printSpinerParams.frameIdx + 1) % frames.length;

    this.restoreCursorPosition(row);
  }

  cursorControl(action: 'hide' | 'show') {
    process.stdout.write(action === 'hide' ? hideCursorANSI : showCursorANSI);
  }

  restoreCursorPosition(row: number) {
    rl.cursorTo(stdout, 0, row);
  }

  cleanup(interverId: NodeJS.Timeout) {
    process.on('SIGINT', () => {
      clearInterval(interverId);
      this.cursorControl('show');
      process.exit();
    });
  }
}

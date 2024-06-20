import process, { stdin } from 'process';
import fs from 'fs';
import rl from 'readline';
import { SpinnerType, Spinners } from './types';
import path from 'path';

const stdout = process.stdout;
const spinnerJsonPath = path.resolve(__dirname, './spinners.json').toString();
const spinners: Spinners = JSON.parse(fs.readFileSync(spinnerJsonPath).toString());

const hideCursorANSI = '\x1B[?25l';
const showCursorANSI = '\x1B[?25h';
const currentCursorANSI = '\x1B[6n';
const spaceANSI = '\x1B[C';

class Spinner {
  constructor(private comment: string = '') {}

  async spin(spinnerType: SpinnerType) {
    try {
      this.cursorControl('hide');
      const [row] = await this.getCursorDimension();

      this.restoreCursorPosition(row);

      const { interval, frames } = spinners[spinnerType];

      let frameIdx = 0;

      const intervalId = setInterval(() => {
        let currentFrame = frames[frameIdx];
        if (currentFrame === undefined) {
          frameIdx = 0;
          currentFrame = frames[frameIdx];
        }

        stdout.write(currentFrame + spaceANSI + this.comment);
        this.restoreCursorPosition(row);
        frameIdx = frameIdx >= frames.length ? 0 : frameIdx + 1;
      }, interval);

      this.cleanup(intervalId);

      return intervalId;
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

new Spinner('안녕, 나는 스피너라고 해').spin('dots2');

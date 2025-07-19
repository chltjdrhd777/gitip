import { MESSAGE } from '@/constants/message';
import { PROCESS_EXIT } from './PROCESS_EXIT';

interface CancelConfig {
  forceCancel?: boolean;
}
export function cancel(error?: any, config?: CancelConfig) {
  const { forceCancel } = config ?? {};
  if (forceCancel) {
    console.log(MESSAGE.cancel);
    PROCESS_EXIT();
  }

  if (error.name === 'ExitPromptError' || error?.message?.includes('User force closed the prompt')) {
    console.log(MESSAGE.cancel);
    PROCESS_EXIT();
  }
}

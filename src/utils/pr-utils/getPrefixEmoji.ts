import { PREFIX_MAP } from '@/constants/prefixMap';

export function getPrefixEmoji(title: string) {
  let _emoji = '';

  for (const [prefix, { emoji }] of Object.entries(PREFIX_MAP)) {
    if (title.includes(prefix)) {
      _emoji = emoji;
      break;
    }
  }

  return _emoji;
}

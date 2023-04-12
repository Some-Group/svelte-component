import { updateCSS, removeCSS } from '../util/Dom/dynamicCSS';
import getScrollBarSize from '../util/getScrollBarSize';
import { isBodyOverflowing } from './util';

const UNIQUE_ID = `sc-util-locker-${Date.now()}`;

let uuid = 0;

export default function useScrollLocker(
  lock?: boolean,
) {
  const mergedLock = !!lock;

  uuid += 1;
  const id = `${UNIQUE_ID}_${uuid}`

  return {
    update() {
      if (mergedLock) {
        const scrollbarSize = getScrollBarSize();
        const isOverflow = isBodyOverflowing();

        updateCSS(
          `
html body {
overflow-y: hidden;
${isOverflow ? `width: calc(100% - ${scrollbarSize}px);` : ''}
}`,
          id,
        );
      } else {
        removeCSS(id);
      }

    },
    destroy() {
      removeCSS(id)
    }
  }
}

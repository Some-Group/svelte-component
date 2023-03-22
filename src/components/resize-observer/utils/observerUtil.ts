import ResizeObserver from "resize-observer-polyfill";

export type ResizeListener = (element: Element) => void;

// =============================== Const ===============================
const elementListeners = new Map<Element, Set<ResizeListener>>();

function onResize(entities: ResizeObserverEntry[]) {
  entities.forEach((entity) => {
    const { target } = entity;
    elementListeners.get(target)?.forEach((listener) => listener(target));
  });
}

// Note: ResizeObserver polyfill not support option to measure border-box resize
const resizeObserver = new ResizeObserver(onResize);

// Dev env only
// export const _el =
//   process.env.NODE_ENV !== "production" ? elementListeners : null; // eslint-disable-line
// export const _rs = process.env.NODE_ENV !== "production" ? onResize : null; // eslint-disable-line

// ============================== Observe ==============================
export function observe(element: Element, callback: ResizeListener) {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Set());
    resizeObserver.observe(element);
  }

  elementListeners.get(element)?.add(callback);
}

export function unobserve(element: Element, callback: ResizeListener) {
  if (elementListeners.has(element)) {
    elementListeners.get(element)?.delete(callback);
    if (!elementListeners.get(element)?.size) {
      resizeObserver.unobserve(element);
      elementListeners.delete(element);
    }
  }
}

export function useObserver(
  data?: any,
  callback?: (data: { size: any; element: HTMLElement; data: any }) => void,
  collectionCallback?: (size: any, element: HTMLElement, data: any) => void
) {
  // ============================= Size =============================
  let sizeRef = {
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1,
  };

  const onInternalResize = (target: Element) => {
    // const { onResize, data } = propsRef.current;

    // const onResize = (data)=> dispatch('resize', data)

    const { width, height } = target.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = target as HTMLElement;

    /**
     * Resize observer trigger when content size changed.
     * In most case we just care about element size,
     * let's use `boundary` instead of `contentRect` here to avoid shaking.
     */
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);

    if (
      sizeRef.width !== fixedWidth ||
      sizeRef.height !== fixedHeight ||
      sizeRef.offsetWidth !== offsetWidth ||
      sizeRef.offsetHeight !== offsetHeight
    ) {
      const size = {
        width: fixedWidth,
        height: fixedHeight,
        offsetWidth,
        offsetHeight,
      };
      sizeRef = size;

      // IE is strange, right?
      const mergedOffsetWidth =
        offsetWidth === Math.round(width) ? width : offsetWidth;
      const mergedOffsetHeight =
        offsetHeight === Math.round(height) ? height : offsetHeight;

      const sizeInfo = {
        ...size,
        offsetWidth: mergedOffsetWidth,
        offsetHeight: mergedOffsetHeight,
      };

      // Let collection know what happened
      collectionCallback?.(sizeInfo, target as HTMLElement, data);

      Promise.resolve().then(() => {
        callback?.({
          size: sizeInfo,
          element: target as HTMLElement,
          data,
        });
      });
    }
  };

  return [onInternalResize];
}

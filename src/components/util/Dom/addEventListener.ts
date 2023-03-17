function addEventListenerWrap<K extends keyof MediaQueryListEventMap>(
  target: MediaQueryList,
  type: K,
  listener: (this: MediaQueryList, event: MediaQueryListEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): { remove: () => void };

function addEventListenerWrap<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  listener: (this: Window, event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): { remove: () => void };

function addEventListenerWrap<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  target: T,
  type: K,
  listener: (this: T, event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): { remove: () => void };

function addEventListenerWrap<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  listener: (this: Document, event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): { remove: () => void };

function addEventListenerWrap<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | void = void
>(
  target: T,
  type: KW | KH | KM,
  listener: (
    this: T,
    evt:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event
  ) => void,
  options?: boolean | AddEventListenerOptions
) {
  if (!(target && target.addEventListener)) return;

  if (target.addEventListener) {
    target.addEventListener(type, listener, options);
  }
  return {
    remove: () => {
      if (target.removeEventListener) {
        target.removeEventListener(type, listener, options);
      }
    },
  };
}

export default addEventListenerWrap;

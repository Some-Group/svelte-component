import { setContext, getContext } from 'svelte'

export const EMPTY_LIST: VoidFunction[] = [];
export const SCPortalContext = "sc-protal-context";

export default function useDom(el: HTMLElement, [initRender, specifyNode]: [boolean, HTMLElement | null]) {

  let mountNode = specifyNode || document.body;

  let appendedRef = false;

  let queue: VoidFunction[] = EMPTY_LIST;

  const queueCreate = getContext<(appendFn?: any) => void>(SCPortalContext);

  const mergedQueueCreate =
    queueCreate ||
    (appendedRef
      ? undefined
      : (appendFn: VoidFunction) => {
        setQueue([appendFn, ...queue]);
      });

  setContext(SCPortalContext, mergedQueueCreate);

  // =========================== DOM ===========================
  function append() {
    if (el) {
      mountNode.appendChild(el);
      el.hidden = false;
    }
    appendedRef = true;
  }

  function cleanup() {
    el && el.parentElement?.removeChild(el);
    appendedRef = false;
  }

  function setQueue(queue: VoidFunction[]) {
    if (queue.length) {
      queue.forEach((appendFn) => appendFn());
    }
  }

  function update([render, specifyNode]: [boolean, HTMLElement | null]) {
    mountNode = specifyNode || document.body;
    if (render) {
      if (queueCreate) {
        queueCreate(append);
      } else {
        append();
      }
    } else {
      cleanup();
    }
  }

  update([initRender, specifyNode])


  return {
    update,
    destroy: cleanup
  }
}

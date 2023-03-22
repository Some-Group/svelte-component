<script lang="ts">
  import { observe, unobserve, useObserver } from "./utils/observerUtil";
  import warning from "../util/warning";

  import type {
    ResizeObserverProps,
    SizeInfo,
    onCollectionResizeType,
  } from "./interface";
  // import toArray from "../util/Children/toArray";
  import { createEventDispatcher, getContext, onMount } from "svelte";

  let childList: HTMLElement[] = [];
  let resizeCache = new Map();

  type $$Props = ResizeObserverProps;

  export let data: any;
  export let disabled: boolean;

  const dispatch = createEventDispatcher<{
    resize: {
      size: SizeInfo;
      element: HTMLElement;
    };
  }>();

  // const INTERNAL_PREFIX_KEY = "sc-observer-key";

  if (process.env.NODE_ENV !== "production") {
    if (childList.length > 1) {
      warning(
        false,
        "Find more than one child node with `children` in ResizeObserver. Please use ResizeObserver.Collection instead."
      );
    } else if (childList.length === 0) {
      warning(
        false,
        "`children` of ResizeObserver is empty. Nothing is in observe."
      );
    }
  }

  const ref = (node: HTMLElement) => {
    childList.push(node);
    // childList = [...childList, node];
  };

  const onCollectionResize =
    getContext<onCollectionResizeType>("onCollectionResize");

  onMount(() => {
    if (!disabled) {
      childList.forEach((child, index) => {
        const [onInternalResize] = useObserver(
          data,
          (data) => dispatch("resize", data),
          onCollectionResize
        );
        observe(child, onInternalResize);
        resizeCache.set(index, onCollectionResize);
      });
    }

    return () => {
      childList.forEach((child, index) => {
        unobserve(child, resizeCache.get(index));
      });
      childList = [];
      resizeCache.clear();
    };
  });
</script>

<slot {ref} />

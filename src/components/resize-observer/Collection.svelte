<script lang="ts">
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import type {
    onCollectionResizeType,
    ResizeInfo,
    SizeInfo,
  } from "./interface";

  const dispatch = createEventDispatcher<{
    batchResize: any[];
  }>();

  let resizeIdRef = 0;
  let resizeInfosRef: ResizeInfo[] = [];

  const onCollectionResize =
    getContext<onCollectionResizeType>("onCollectionResize");

  const onResize = (size: SizeInfo, element: HTMLElement, data: any) => {
    resizeIdRef += 1;

    const currentId = resizeIdRef;

    resizeInfosRef.push({
      size,
      element,
      data,
    });

    Promise.resolve().then(() => {
      if (currentId === resizeIdRef) {
        dispatch("batchResize", resizeInfosRef);
        resizeInfosRef = [];
      }
    });

    // Continue bubbling if parent exist
    onCollectionResize?.(size, element, data);
  };

  setContext<onCollectionResizeType>("onCollectionResize", onResize);
</script>

<slot />

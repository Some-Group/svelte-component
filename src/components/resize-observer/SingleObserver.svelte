<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { observe, unobserve, useObserver } from "./utils/observerUtil";
  import type { SizeInfo } from "./interface";

  export let disabled: boolean = false;
  export let data: any = null;

  let nodeRef: HTMLElement;
  $: nodeRef;

  const dispatch = createEventDispatcher<{
    resize: {
      size: SizeInfo;
      element: HTMLElement;
    };
  }>();

  const ref = (node: HTMLElement) => {
    if (node) {
      nodeRef = node;
    }
  };

  const [onInternalResize] = useObserver((data) => dispatch("resize", data));

  onMount(() => {
    if (nodeRef && !disabled) {
      observe(nodeRef, onInternalResize);
    }

    return () => unobserve(nodeRef, onInternalResize);
  });
</script>

<slot {ref} />

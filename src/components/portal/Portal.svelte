<script lang="ts">
  import { onMount } from "svelte";
  import { inlineMock } from "./mock";
  import canUseDom from "../util/Dom/canUseDom";
  import type { PortalProps } from "./interface";
  import { getPortalContainer } from "./helper";
  import scrollLocker from "./useScrollLocker";
  import { dom } from "./actions";

  type $$Props = PortalProps;

  export let open: $$Props["open"];
  export let autoLock: $$Props["autoLock"];
  export let getContainer: $$Props["getContainer"];
  export let debug: $$Props["debug"];
  export let autoDestroy: $$Props["autoDestroy"] = true;

  let flag = false;

  $: shouldRender = autoDestroy || open ? open : false;

  $: mergedRender = shouldRender || open;

  // specify container
  $: innerContainer = getPortalContainer(getContainer);

  // Render inline
  $: renderInline = innerContainer === false || inlineMock();

  let slotRef: HTMLElement;

  let locker: {
    update(): void;
    destroy(): void;
  };

  const ref = (node: HTMLElement) => {
    slotRef = node;
  };

  $: {
    if (flag && open) {
      locker = scrollLocker(
        autoLock && open && canUseDom() && (!renderInline || !innerContainer)
      );

      locker?.update();
    } else {
      locker?.destroy();
    }
  }

  onMount(() => {
    flag = true;
  });
</script>

{#if renderInline}
  <slot {ref} />
{:else if !innerContainer}
  <div use:dom={[!!mergedRender, undefined]} hidden>
    <slot {ref} />
  </div>
{:else}
  <div use:dom={[!!mergedRender, innerContainer]} hidden>
    <slot {ref} />
  </div>
{/if}

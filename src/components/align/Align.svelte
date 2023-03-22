<script lang="ts">
  import { alignElement, alignPoint } from "dom-align";
  import { afterUpdate, createEventDispatcher, onDestroy } from "svelte";
  import useBuffer from "./hooks/useBuffer";
  import isVisible from "../util/Dom/isVisible";
  import addEventListener from "../util/Dom/addEventListener";
  import isEqual from "../util/isEqual";
  import { browser } from "$app/environment";

  import {
    restoreFocus,
    isSamePoint,
    monitorResize,
    getElement,
    getPoint,
  } from "./util";

  import type {
    AlignResult,
    AlignType,
    TargetPoint,
    AlignProps,
  } from "./interface";

  type $$Props = AlignProps;

  export let disabled: AlignProps["disabled"];
  export let target: AlignProps["target"];
  export let align: AlignProps["align"];
  export let monitorBufferTime: AlignProps["monitorBufferTime"];
  // export let onAlign: boolean;

  $: forceAlignPropsRef = {
    disabled,
    target,
    align,
  };
  const cacheRef: {
    element?: HTMLElement;
    point?: TargetPoint;
    align?: AlignType;
  } = {};
  /** Popup node ref */
  let fragmentRef: any;

  let nodeRef: HTMLElement | undefined;
  $: nodeRef;

  const dispatch = createEventDispatcher<{
    align: any;
  }>();
  $: [forceAlign, cancelForceAlign] = useBuffer(() => {
    const {
      disabled: latestDisabled,
      target: latestTarget,
      align: latestAlign,
    } = forceAlignPropsRef;

    const source = nodeRef;

    if (!latestDisabled && latestTarget && source) {
      let result: AlignResult | undefined;
      const element = getElement(latestTarget);
      const point = getPoint(latestTarget);

      cacheRef.element = element;
      cacheRef.point = point;
      cacheRef.align = latestAlign;

      // IE lose focus after element realign
      // We should record activeElement and restore later
      const { activeElement } = document;

      // We only align when element is visible
      if (element && isVisible(element)) {
        result = alignElement(source, element, latestAlign);
      } else if (point) {
        result = alignPoint(source, point, latestAlign);
      }

      if (activeElement) {
        restoreFocus(activeElement as HTMLElement, source);
      }

      if (result) {
        dispatch("align", {
          source,
          result,
        });
        // latestOnAlign(source, result);
      }

      return true;
    }

    return false;
  }, monitorBufferTime);

  $: element = getElement(target);
  $: point = getPoint(target);

  $: cancelMonitorResizeNode = monitorResize(nodeRef, forceAlign);
  $: cancelMonitorResizeElement = monitorResize(element, forceAlign);
  $: removeEv = browser && addEventListener(window, "resize", forceAlign);

  afterUpdate(() => {
    if (!disabled) {
      forceAlign();
    } else {
      cancelForceAlign();
    }

    // every time update will be force Align
    if (
      cacheRef.element !== element ||
      !isSamePoint(cacheRef.point, point) ||
      !isEqual(cacheRef.align, align)
    ) {
      forceAlign();
    }
  });

  onDestroy(() => {
    cancelMonitorResizeElement();
    cancelMonitorResizeNode();
    removeEv && removeEv.remove();
    cancelForceAlign();
  });

  const ref = (node: HTMLElement) => {
    nodeRef = node;
  };

  // export interface RefAlign {
  //   forceAlign: () => void;
  // }
</script>

<slot {ref} />

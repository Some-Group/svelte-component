<script lang="ts">
  import classNames from "classnames";
  import type { ChangeEventHandler, HTMLAttributes } from "svelte/elements";
  import { createEventDispatcher } from "svelte";

  interface CheckboxChangeEvent {
    target: CheckboxChangeEventTarget;
    stopPropagation: () => void;
    preventDefault: () => void;
  }
  interface CheckboxChangeEventTarget extends CheckboxProps {
    checked: boolean;
  }

  interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
    prefixCls?: string;
    defaultChecked?: boolean;
  }

  interface $$Events {
    change: CheckboxChangeEvent;
  }

  type $$Props = CheckboxProps;

  let className: string;
  export { className as class };
  export let prefixCls = "sc-checkbox";
  export let disabled: boolean;
  export let checked: boolean;
  export let defaultChecked = false;
  export let style: string;

  let inputRef;

  const dispatch = createEventDispatcher<{
    change: CheckboxChangeEvent;
    blur: any;
    focus: any;
  }>();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (disabled) {
      return;
    }

    if (!("checked" in $$props)) {
      rawValue = e.currentTarget.checked;
    }

    dispatch("change", {
      target: {
        ...$$props,
        checked: e.currentTarget.checked,
      },
      stopPropagation() {
        e.stopPropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
    });
  };

  $: rawValue = checked === undefined ? defaultChecked : checked;

  $: classString = classNames(prefixCls, className, {
    [`${prefixCls}-checked`]: rawValue,
    [`${prefixCls}-disabled`]: disabled,
  });
</script>

<span class={classString} {style}>
  <input
    bind:this={inputRef}
    {...$$restProps}
    class={`${prefixCls}-input`}
    on:change={handleChange}
    on:focus={(e) => {
      dispatch("blur", e);
    }}
    on:blur={(e) => {
      dispatch("focus", e);
    }}
    checked={!!rawValue}
    {disabled}
    type="checkbox"
  />
  <span class={`${prefixCls}-inner`} />
</span>

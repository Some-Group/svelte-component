<script lang="ts">
    import classNames from "classnames";
    import { HTMLInputAttributes, ChangeEventHandler } from "svelte/elements";
    import { createEventDispatcher } from "svelte";

    interface CheckboxChangeEvent {
        target: HTMLInputElement;
        stopPropagation: () => void;
        preventDefault: () => void;
    }

    interface CheckboxProps extends Omit<HTMLInputAttributes, "on:change"> {
        externalCls?: string;
        prefixCls?: string;
    }

    type $$Props = CheckboxProps;

    export let prefixCls = "sc-checkbox";
    export let disabled: boolean;
    export let checked: boolean;
    export let defaultChecked = false;
    export let style: string;

    let rawValue = defaultChecked || checked;
    let inputRef: HTMLInputElement;

    const dispatch = createEventDispatcher<{ change: CheckboxChangeEvent }>();

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatch("change", {
            target: inputRef,
            stopPropagation() {
                e.stopPropagation();
            },
            preventDefault() {
                e.preventDefault();
            },
        });
    };

    const classString = classNames(prefixCls, $$props.class, {
        [`${prefixCls}-checked`]: rawValue,
        [`${prefixCls}-disabled`]: disabled,
    });
</script>

<span class={classString} {style}>
    <input
        {...$$restProps}
        class={`${prefixCls}-inner`}
        bind:this={inputRef}
        on:change={handleChange}
        {disabled}
        type="checkbox"
    />
</span>

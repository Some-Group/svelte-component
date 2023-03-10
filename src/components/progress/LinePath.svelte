<script lang="ts">
    import type { ProgressProps } from "./interface";
    import { defaultProps } from "./common";

    export let prefixCls: ProgressProps["prefixCls"] = defaultProps.prefixCls;
    export let pathString: string;
    export let strokeColor: ProgressProps["strokeColor"] | undefined =
        defaultProps.strokeColor;
    export let strokeLinecap: ProgressProps["strokeLinecap"] =
        defaultProps.strokeLinecap;
    export let strokeWidth: ProgressProps["strokeWidth"] =
        defaultProps.strokeWidth;
    export let index: number;
    export let percent: number;
    export let transition: ProgressProps["transition"];

    const strokeColorList = Array.isArray(strokeColor)
        ? strokeColor
        : [strokeColor];

    let stackPtg = 0;

    let dashPercent = 1;
    switch (strokeLinecap) {
        case "round":
            dashPercent = 1 - strokeWidth! / 100;
            break;
        case "square":
            dashPercent = 1 - strokeWidth! / 2 / 100;
            break;
        default:
            dashPercent = 1;
            break;
    }

    const pathStyle = {
        strokeDasharray: `${percent * dashPercent}px, 100px`,
        strokeDashoffset: `-${stackPtg}px`,
        transition:
            transition ||
            "stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear",
    };

    const color =
        strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
</script>

<path
    class={`${prefixCls}-line-path`}
    d={pathString}
    stroke={color}
    stroke-linecap={strokeLinecap}
    stroke-width={strokeWidth}
    fill-opacity="0"
    style="stroke-dasharray: {pathStyle.strokeDasharray}; stroke-dashoffset: {pathStyle.strokeDashoffset}; transition: {pathStyle.transition}"
/>

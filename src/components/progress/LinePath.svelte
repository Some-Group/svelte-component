<script lang="ts">
    import type { ProgressProps } from "./interface";
    import { defaultProps } from "./common";
    import { onMount } from "svelte";
    import { toArray } from "./utils";

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

    const strokeColorList = toArray(strokeColor);

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

    $: pathStyle = {
        strokeDasharray: `${percent * dashPercent}px, 100px`,
        strokeDashoffset: `-${stackPtg}px`,
        transition:
            transition ||
            "stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear",
    };

    const color = (strokeColorList[index] ||
        strokeColorList[strokeColorList.length - 1]) as string;

    let pathRef: SVGPathElement;

    onMount(() => {
        let prevTimeStamp = Date.now();
        let updated = false;

        if (!pathRef) {
            return;
        }
        updated = true;
        const pathStyle = pathRef.style;
        pathStyle.transitionDuration = ".3s, .3s, .3s, .06s";

        if (prevTimeStamp && now - prevTimeStamp < 100) {
            pathStyle.transitionDuration = "0s, 0s";
        }
        console.log(pathRef.style);

        // let updated = false;

        // pathsRef.current.forEach((path) => {
        //     if (!path) {
        //         return;
        //     }

        //     updated = true;
        //     const pathStyle = path.style;
        //     pathStyle.transitionDuration = ".3s, .3s, .3s, .06s";

        //     if (prevTimeStamp.current && now - prevTimeStamp.current < 100) {
        //         pathStyle.transitionDuration = "0s, 0s";
        //     }
        // });

        // if (updated) {
        //     prevTimeStamp.current = Date.now();
        // }
    });
</script>

<path
    bind:this={pathRef}
    class={`${prefixCls}-line-path`}
    d={pathString}
    stroke={color}
    stroke-linecap={strokeLinecap}
    stroke-width={strokeWidth}
    fill-opacity="0"
    style="stroke-dasharray: {pathStyle.strokeDasharray}; stroke-dashoffset: {pathStyle.strokeDashoffset}; transition: {pathStyle.transition}"
/>

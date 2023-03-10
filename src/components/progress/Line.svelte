<script lang="ts">
    import classNames from "classnames";
    import type { ProgressProps } from "./interface";
    import { defaultProps } from "./common";
    import LinePath from "./LinePath.svelte";

    type $$Props = ProgressProps;

    let className: string | undefined = defaultProps.class;
    export { className as class };
    export let prefixCls: ProgressProps["prefixCls"] = defaultProps.prefixCls;
    export let percent: ProgressProps["percent"] = defaultProps.percent;
    export let strokeWidth: ProgressProps["strokeWidth"] =
        defaultProps.strokeWidth;
    export let strokeLinecap: ProgressProps["strokeLinecap"] =
        defaultProps.strokeLinecap;
    export let style: ProgressProps["style"] = "";
    export let trailWidth: ProgressProps["trailWidth"] =
        defaultProps.trailWidth;
    export let strokeColor: ProgressProps["strokeColor"] =
        defaultProps.strokeColor;
    export let transition: ProgressProps["transition"];

    const percentList = Array.isArray(percent) ? percent : [percent];
    // NOTE why using the ! for strokeWidth
    // because setting up a default value for strokeWidth
    // that value will be not undefined
    const center = strokeWidth! / 2;
    const right = 100 - strokeWidth! / 2;
    const pathString = `M ${strokeLinecap === "round" ? center : 0},${center}
         L ${strokeLinecap === "round" ? right : 100},${center}`;

    const viewBoxString = `0 0 100 ${strokeWidth}`;
</script>

<svg
    class={classNames(`${prefixCls}-line`, className)}
    viewBox={viewBoxString}
    preserveAspectRatio="none"
    {style}
    {...$$restProps}
>
    <path
        class={`${prefixCls}-line-trail`}
        d={pathString}
        stroke-linecap={strokeLinecap}
        stroke-width={trailWidth || strokeWidth}
        fill-opacity="0"
    />
    {#each percentList as ptg, index}
        <LinePath
            percent={ptg}
            {index}
            {pathString}
            {prefixCls}
            {strokeColor}
            {strokeWidth}
            {strokeLinecap}
            {transition}
        />
    {/each}
</svg>

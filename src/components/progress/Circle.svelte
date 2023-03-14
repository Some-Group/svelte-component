<script lang="ts">
  import classNames from "classnames";
  import type { ProgressProps, StrokeColorType } from "./interface";
  import { toArray, stripPercentToNumber, getCircleStyle } from "./utils";
  import { VIEW_BOX_SIZE, useId, defaultProps } from "./common";
  import CirclePath from "./CirclePath.svelte";

  type $$Props = ProgressProps;

  let className: string | undefined = defaultProps.class;
  export { className as class };
  export let id: ProgressProps["id"];
  export let prefixCls: ProgressProps["prefixCls"] = defaultProps.prefixCls;
  export let percent: ProgressProps["percent"] = defaultProps.percent;
  export let strokeWidth: ProgressProps["strokeWidth"] =
    defaultProps.strokeWidth;
  export let strokeLinecap: ProgressProps["strokeLinecap"] =
    defaultProps.strokeLinecap;
  export let style: ProgressProps["style"] = "";
  export let trailWidth: ProgressProps["trailWidth"] = defaultProps.trailWidth;
  export let strokeColor: ProgressProps["strokeColor"] =
    defaultProps.strokeColor;
  export let transition: ProgressProps["transition"];
  export let gapDegree: ProgressProps["gapDegree"] = 0;
  export let steps: ProgressProps["steps"];
  export let trailColor: ProgressProps["trailColor"] = defaultProps.trailColor;
  export let gapPosition: ProgressProps["gapPosition"] =
    defaultProps.gapPosition;

  const mergedId = useId(id);
  const gradientId = `${mergedId}-gradient`;

  const radius = VIEW_BOX_SIZE / 2 - strokeWidth! / 2;
  const perimeter = Math.PI * 2 * radius;
  const rotateDeg = gapDegree! > 0 ? 90 + gapDegree! / 2 : -90;
  const perimeterWithoutGap = perimeter * ((360 - gapDegree!) / 360);

  const { count: stepCount, space: stepSpace } =
    typeof steps === "object" ? steps : { count: steps, space: 2 };

  $: percentList = toArray(percent);

  const strokeColorList = toArray<StrokeColorType>(strokeColor!);

  // TODO: fix ts type
  const gradient = strokeColorList.find(
    (color) => color && typeof color === "object"
  ) as Record<string, any>;

  // order gradient by key name
  const stopList =
    gradient &&
    Object.keys(gradient).sort(
      (a, b) => stripPercentToNumber(a) - stripPercentToNumber(b)
    );

  let stackPtg = 0;

  const add = (percent: number) => {
    const ptg = stackPtg;
    stackPtg += percent;
    return ptg;
  };
</script>

<svg
  class={classNames(`${prefixCls}-circle`, className)}
  viewBox={`${-VIEW_BOX_SIZE / 2} ${
    -VIEW_BOX_SIZE / 2
  } ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
  {style}
  {id}
  role="presentation"
  {...$$restProps}
>
  {#if gradient}
    <defs>
      <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="0%">
        {#each stopList as key}
          <stop offset={key} stop-color={gradient[key]} />
        {/each}
      </linearGradient>
    </defs>
  {/if}

  {#if stepCount}
    {#each percentList as percent}{/each}
  {:else}
    <CirclePath
      class={`${prefixCls}-circle-trail`}
      {radius}
      color={trailColor}
      {strokeLinecap}
      start={0}
      end={100}
      {gapDegree}
      {rotateDeg}
      {perimeter}
      {perimeterWithoutGap}
      strokeWidth={trailWidth || strokeWidth}
    />
    {#each percentList.reverse() as percent, index}
      <CirclePath
        class={`${prefixCls}-circle-path`}
        {gradientId}
        {radius}
        color={strokeColorList[index] ||
          strokeColorList[strokeColorList.length - 1]}
        stroke={strokeColor}
        {strokeLinecap}
        start={add(percent)}
        end={percent}
        {gapDegree}
        {rotateDeg}
        {perimeter}
        {perimeterWithoutGap}
        {strokeWidth}
      />
    {/each}
  {/if}
</svg>

<script lang="ts">
  import classNames from "classnames";
  import type { ProgressProps, StrokeColorType } from "./interface";
  import { toArray, stripPercentToNumber, getCircleStyle } from "./utils";
  import { VIEW_BOX_SIZE, useId, defaultProps } from "./common";
  import { formatStyle } from "../../utils";

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

  $: circleStyle = formatStyle(
    getCircleStyle(
      perimeter,
      perimeterWithoutGap,
      0,
      100,
      rotateDeg,
      gapDegree,
      gapPosition,
      trailColor,
      strokeLinecap,
      strokeWidth
    )
  );

  $: percentList = stepCount
    ? getStepStokeList(toArray(percent))
    : getStrokeList(toArray(percent));

  const strokeColorList = toArray<StrokeColorType>(strokeColor!);

  const gradient = strokeColorList.find(
    (color) => color && typeof color === "object"
  ) as Record<string, any>;

  // order gradient by key name
  const stopList =
    gradient &&
    Object.keys(gradient).sort(
      (a, b) => stripPercentToNumber(a) - stripPercentToNumber(b)
    );

  function getStrokeList(percentList: number[]) {
    let stackPtg = 0;
    return percentList.map((ptg, index) => {
      const color =
        strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
      const stroke =
        color && typeof color === "object" ? `url(#${gradientId})` : undefined;
      const circleStyleForStack = getCircleStyle(
        perimeter,
        perimeterWithoutGap,
        stackPtg,
        ptg,
        rotateDeg,
        gapDegree,
        gapPosition,
        color,
        strokeLinecap,
        strokeWidth
      );
      stackPtg += ptg;
      return {
        stroke,
        style: formatStyle(circleStyleForStack),
        opacity: ptg === 0 ? 0 : 1,
      };
    });
  }

  function getStepStokeList(percentList: number[]) {
    // only show the first percent when pass steps
    const current = Math.round(stepCount * (percentList[0] / 100));
    const stepPtg = 100 / stepCount;

    let stackPtg = 0;
    return new Array(stepCount).fill(null).map((_, index) => {
      const color = index <= current - 1 ? strokeColorList[0] : trailColor;
      const stroke =
        color && typeof color === "object" ? `url(#${gradientId})` : undefined;
      const circleStyleForStack = getCircleStyle(
        perimeter,
        perimeterWithoutGap,
        stackPtg,
        stepPtg,
        rotateDeg,
        gapDegree,
        gapPosition,
        color,
        "buttom",
        strokeWidth,
        stepSpace
      );

      stackPtg +=
        ((perimeterWithoutGap -
          circleStyleForStack.strokeDashoffset +
          stepSpace) *
          100) /
        perimeterWithoutGap;

      return {
        stroke,
        style: formatStyle(circleStyleForStack),
      };
    });
  }
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
    {#each percentList as percent}
      <circle
        {...percent}
        class={`${prefixCls}-circle-path`}
        r={radius}
        cx={0}
        cy={0}
        stroke-width={strokeWidth}
        opacity={1}
      />
    {/each}
  {:else}
    <circle
      class={`${prefixCls}-circle-trail`}
      r={radius}
      cx={0}
      cy={0}
      stroke={trailColor}
      stroke-linecap={strokeLinecap}
      stroke-width={trailWidth || strokeWidth}
      style={circleStyle}
    />
    {#each percentList as percent}
      <circle
        {...percent}
        class={`${prefixCls}-circle-path`}
        r={radius}
        cx={0}
        cy={0}
        stroke-linecap={strokeLinecap}
        stroke-width={strokeWidth}
      />
    {/each}
  {/if}
</svg>

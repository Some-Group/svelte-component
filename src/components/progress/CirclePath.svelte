<script lang="ts">
  import type { StrokeLinecapType, GapPositionType } from "./interface";
  import { getCircleStyle } from "./utils";

  let className: string;
  export { className as class };
  export let gradientId: string | number;
  export let perimeter: number;
  export let perimeterWithoutGap: number;
  export let rotateDeg: number;
  export let gapPosition: GapPositionType = "bottom";
  export let strokeLinecap: StrokeLinecapType;
  export let strokeWidth: number;
  export let gapDegree: number = 0;
  export let radius: number;
  export let end: number;
  export let start: number;
  export let color: string | Record<string, string>;

  const stroke =
    color && typeof color === "object" ? `url(#${gradientId})` : undefined;

  $: circleStyleForStack = getCircleStyle(
    perimeter,
    perimeterWithoutGap,
    start,
    end,
    rotateDeg,
    gapDegree,
    gapPosition,
    color,
    strokeLinecap,
    strokeWidth
  );
</script>

<circle
  class={className}
  r={radius}
  cx={0}
  cy={0}
  {stroke}
  stroke-linecap={strokeLinecap}
  stroke-width={strokeWidth}
  opacity={end === 0 ? 0 : 1}
  style={circleStyleForStack}
/>

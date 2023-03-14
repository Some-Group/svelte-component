import type { ProgressProps } from "./interface";

export function stripPercentToNumber(percent: string) {
  return +percent.replace("%", "");
}

export function toArray<T>(value: T | T[]): T[] {
  const mergedValue = value ?? [];
  return Array.isArray(mergedValue) ? mergedValue : [mergedValue];
}

export const getCircleStyle = (
  perimeter: number,
  perimeterWithoutGap: number,
  offset: number,
  percent: number,
  rotateDeg: number,
  gapDegree: number,
  gapPosition: ProgressProps["gapPosition"] | undefined,
  strokeColor: string | Record<string, string>,
  strokeLinecap: ProgressProps["strokeLinecap"],
  strokeWidth: number,
  stepSpace = 0
) => {
  const offsetDeg = (offset / 100) * 360 * ((360 - gapDegree) / 360);
  const positionDeg =
    gapDegree === 0
      ? 0
      : {
          bottom: 0,
          top: 180,
          left: 90,
          right: -90,
        }[gapPosition ?? "bottom"];

  let strokeDashoffset = ((100 - percent) / 100) * perimeterWithoutGap;
  // Fix percent accuracy when strokeLinecap is round
  // https://github.com/ant-design/ant-design/issues/35009
  if (strokeLinecap === "round" && percent !== 100) {
    strokeDashoffset += strokeWidth / 2;
    // when percent is small enough (<= 1%), keep smallest value to avoid it's disappearance
    if (strokeDashoffset >= perimeterWithoutGap) {
      strokeDashoffset = perimeterWithoutGap - 0.01;
    }
  }

  return {
    stroke: typeof strokeColor === "string" ? strokeColor : undefined,
    strokeDasharray: `${perimeterWithoutGap}px ${perimeter}`,
    strokeDashoffset: strokeDashoffset + stepSpace,
    transform: `rotate(${rotateDeg + offsetDeg + positionDeg}deg)`,
    transformOrigin: "0 0",
    transition:
      "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",
    fillOpacity: 0,
  };
};

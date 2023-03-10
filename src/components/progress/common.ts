import type { ProgressProps } from "./interface";

export const defaultProps: Partial<ProgressProps> = {
  class: "",
  percent: 0,
  prefixCls: "sc-progress",
  strokeColor: "#2db7f5",
  strokeLinecap: "round",
  strokeWidth: 1,
  trailColor: "#D9D9D9",
  trailWidth: 1,
  gapPosition: "bottom",
};

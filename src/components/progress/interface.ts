export interface ProgressProps {
  id?: string;
  strokeWidth?: number;
  trailWidth?: number;
  class?: string;
  percent?: number | number[];
  strokeColor?: StrokeColorType;
  trailColor?: string;
  strokeLinecap?: StrokeLinecapType;
  prefixCls?: string;
  style?: string;
  gapDegree?: number;
  gapPosition?: GapPositionType;
  transition?: string;
  // onClick?: React.MouseEventHandler;
  steps?: number | { count: number; space: number };
}

export type BaseStrokeColorType = string | Record<string, string>;

export type StrokeColorType = BaseStrokeColorType | BaseStrokeColorType[];

export type GapPositionType = "top" | "right" | "bottom" | "left";

export type StrokeLinecapType = "round" | "butt" | "square";

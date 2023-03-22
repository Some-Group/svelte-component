// const INTERNAL_PREFIX_KEY = "rc-observer-key";

// import { _rs } from "./utils/observerUtil";

// export {
//   /** @private Test only for mock trigger resize event */
//   _rs,
// };

export interface SizeInfo {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}

export type OnResize = (size: SizeInfo, element: HTMLElement) => void;

export interface ResizeObserverProps {
  /** Pass to ResizeObserver.Collection with additional data */
  data?: any;
  disabled?: boolean;
  /** Trigger if element resized. Will always trigger when first time render. */
  "on:resize"?: OnResize;
}

export type onCollectionResizeType = (
  size: SizeInfo,
  element: HTMLElement,
  data: any
) => void;

export interface ResizeInfo {
  size: SizeInfo;
  data: any;
  element: HTMLElement;
}

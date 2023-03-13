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

// Circle view box size
export const VIEW_BOX_SIZE = 100;

let uuid = 0;

export const useId = (id?: string) => {
  return id || uuid++;
};

// export const useTransitionDuration = (): SVGPathElement[] => {
//   const pathsRef = useRef<SVGPathElement[]>([]);
//   const prevTimeStamp = useRef(null);

//   useEffect(() => {
//     const now = Date.now();
//     let updated = false;

//     pathsRef.current.forEach((path) => {
//       if (!path) {
//         return;
//       }

//       updated = true;
//       const pathStyle = path.style;
//       pathStyle.transitionDuration = '.3s, .3s, .3s, .06s';

//       if (prevTimeStamp.current && now - prevTimeStamp.current < 100) {
//         pathStyle.transitionDuration = '0s, 0s';
//       }
//     });

//     if (updated) {
//       prevTimeStamp.current = Date.now();
//     }
//   });

//   return pathsRef.current;
// };

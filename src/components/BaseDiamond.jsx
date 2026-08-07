
// import { Card, CardContent } from "./ui/card";
// import { formatPlayer } from "@/state/gameLogic";
// import { Users} from "lucide-react";

// function Base({
//   occupied,
//   label,
//   className = "",
// }) {
//   return (
//     <div className={`z-20 ${className}`}>
//       <div
//         className={[
//           "flex w-32 h-32 rotate-45 bg-red-500",
//           occupied
//             ? `
//               border-scoreboard-amber
//               bg-scoreboard-amber
//               shadow-[0_0_12px_rgb(218_170_61/70%)]
//             `
//             : `
//               border-scoreboard-cream/80
//               bg-scoreboard-cream
//             `,
//         ].join(" ")}
//       >
//         <span
//           className={[
//             "-rotate-45 font-heading text-[8px] font-bold sm:text-[9px]",
//             occupied
//               ? "text-scoreboard-black"
//               : "text-scoreboard-dark",
//           ].join(" ")}
//         >
//           {label}
//         </span>

        
//       </div>
//     </div>
//   )
// }

// export function BaseDiamond({ bases }) {
//   return (
    
// <Card className="scoreboard-panel rounded-none text-scoreboard-cream">
//   <CardContent className="relative z-10 p-4 sm:p-5">
//     <div className="mb-4 border-b-2 border-scoreboard-red pb-3 text-center">
//       <div className="scoreboard-title">Base Runners</div>
//     </div>

//     <div className="mx-auto w-full max-w-md">
//     <div className="relative aspect-[500/430] overflow-hidden bg-scoreboard-dark">

//       <svg
//   viewBox="0 0 500 430"
//   className="absolute inset-0 h-full w-full"
//   aria-hidden="true"
// >
//   <defs>
//     <linearGradient
//       id="fieldGrass"
//       x1="0"
//       y1="0"
//       x2="0"
//       y2="1"
//     >
//       <stop offset="0%" stopColor="#2e6a3f" />
//       <stop offset="100%" stopColor="#1e4f31" />
//     </linearGradient>

//     <radialGradient
//       id="infieldDirt"
//       cx="50%"
//       cy="55%"
//       r="65%"
//     >
//       <stop offset="0%" stopColor="#b78654" />
//       <stop offset="100%" stopColor="#8a603d" />
//     </radialGradient>

//     <pattern
//       id="grassStripes"
//       width="62"
//       height="62"
//       patternUnits="userSpaceOnUse"
//       patternTransform="rotate(18)"
//     >
//       <rect
//         width="31"
//         height="62"
//         fill="rgba(255,255,255,0.04)"
//       />
//       <rect
//         x="31"
//         width="31"
//         height="62"
//         fill="rgba(0,0,0,0.035)"
//       />
//     </pattern>

//     <clipPath id="fieldClip">
//       <path
//         d="
//           M 250 408
//           L 28 190
//           Q 70 48 250 28
//           Q 430 48 472 190
//           Z
//         "
//       />
//     </clipPath>
//   </defs>

//   {/* Entire fan-shaped field */}
//   <g clipPath="url(#fieldClip)">
//     <rect
//       width="500"
//       height="430"
//       fill="url(#fieldGrass)"
//     />

//     <rect
//       width="500"
//       height="430"
//       fill="url(#grassStripes)"
//     />

//     {/* Infield dirt circle */}
//     <circle
//       cx="250"
//       cy="292"
//       r="118"
//       fill="url(#infieldDirt)"
//     />

//     {/* Infield grass diamond */}
//     <polygon
//       points="
//         250,214
//         329,292
//         250,370
//         171,292
//       "
//       fill="#285b39"
//     />

//     {/* Base paths */}
//     <polyline
//       points="
//         250,370
//         171,292
//         250,214
//         329,292
//         250,370
//       "
//       fill="none"
//       stroke="rgba(218,190,145,0.55)"
//       strokeWidth="15"
//       strokeLinejoin="round"
//     />

//     {/* Third-base foul line */}
//     <line
//       x1="250"
//       y1="395"
//       x2="28"
//       y2="190"
//       stroke="rgba(239,232,207,0.9)"
//       strokeWidth="3"
//     />

//     {/* First-base foul line */}
//     <line
//       x1="250"
//       y1="395"
//       x2="472"
//       y2="190"
//       stroke="rgba(239,232,207,0.9)"
//       strokeWidth="3"
//     />

//     {/* Pitcher's mound
//     <circle
//       cx="250"
//       cy="292"
//       r="22"
//       fill="#ad7b4c"
//       stroke="rgba(239,232,207,0.5)"
//       strokeWidth="1.5"
//     /> */}

//     <rect
//       x="239"
//       y="290"
//       width="22"
//       height="4"
//       rx="2"
//       fill="#efe8cf"
//     />
//   </g>

//   {/* Outfield fence */}
//   {/* <path
//     d="
//       M 28 190
//       Q 70 48 250 28
//       Q 430 48 472 190
//     "
//     fill="none"
//     stroke="rgba(239,232,207,0.7)"
//     strokeWidth="3"
//     strokeLinecap="round"
//   /> */}

//   {/* Outer foul edges */}
//   <line
//     x1="250"
//     y1="408"
//     x2="28"
//     y2="190"
//     stroke="rgba(239,232,207,0.65)"
//     strokeWidth="2"
//   />

//   <line
//     x1="250"
//     y1="408"
//     x2="472"
//     y2="190"
//     stroke="rgba(239,232,207,0.65)"
//     strokeWidth="2"
//   />

//   {/* Center field label */}
//   <text
//     x="250"
//     y="95"
//     textAnchor="middle"
//     fill="rgba(239,232,207,0.52)"
//     fontSize="13"
//     fontWeight="700"
//     letterSpacing="2"
//   >
//     CF
//   </text>
// </svg>

// <Base
//   occupied={bases.second}
//   className="
//     absolute left-1/2 top-[49.8%]
//     -translate-x-1/2 -translate-y-1/2
//   "
//   label="2B"
// />

// <Base
//   occupied={bases.third}
//   className="
//     absolute left-[34.2%] top-[68%]
//     -translate-x-1/2 -translate-y-1/2
//   "
//   label="3B"
// />

// <Base
//   occupied={bases.first}
//   className="
//     absolute left-[65.8%] top-[68%]
//     -translate-x-1/2 -translate-y-1/2
//   "
//   label="1B"
// />

// <div
//   className="
//     absolute bottom-[4.5%] left-1/2 z-20
//     -translate-x-1/2
//   "
// >
//   <div
//     className="
//       flex h-8 w-9 items-center justify-center
//       bg-scoreboard-cream
//       text-[9px] font-bold text-scoreboard-dark
//       [clip-path:polygon(0_0,100%_0,100%_58%,50%_100%,0_58%)]
//     "
//   >
//     H
//   </div>
// </div>
//       </div>
//     </div>
//   </CardContent>
// </Card>
//   );
// }
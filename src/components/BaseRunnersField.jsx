import { Card, CardContent } from "@/components/ui/card"

function FieldBase({
  occupied,
  label,
  className = "",
}) {
  return (
    <div
      className={[
        "ballpark-base",
        occupied
          ? "ballpark-base-occupied"
          : "ballpark-base-empty",
        className,
      ].join(" ")}
    >
      <span className="ballpark-base-label">
        {label}
      </span>
    </div>
  )
}

export function BaseRunnersField({
  bases,
  title = "Base Runners",
}) {
  return (
    <Card className="ballpark-card">
      <CardContent className="relative z-10 p-4 sm:p-5">
        <div className="ballpark-header mb-4">
          <h2 className="scoreboard-title text-2xl sm:text-3xl">
            {title}
          </h2>
        </div>

        <div className="ballpark-canvas">
          <svg
            viewBox="0 0 900 620"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Baseball field showing occupied bases"
          >
            <defs>
              <linearGradient
                id="fieldBackground"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#173f2d" />
                <stop offset="100%" stopColor="#0d281d" />
              </linearGradient>

              <radialGradient
                id="fieldGrass"
                cx="50%"
                cy="72%"
                r="75%"
              >
                <stop offset="0%" stopColor="#396d3d" />
                <stop offset="100%" stopColor="#1e4d30" />
              </radialGradient>

              <radialGradient
                id="infieldDirt"
                cx="50%"
                cy="60%"
                r="70%"
              >
                <stop offset="0%" stopColor="#b88855" />
                <stop offset="100%" stopColor="#805937" />
              </radialGradient>

              <linearGradient
                id="bleacherMetal"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#b4aa8e" />
                <stop offset="100%" stopColor="#615d50" />
              </linearGradient>

              <linearGradient
                id="roofGreen"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#35584c" />
                <stop offset="100%" stopColor="#172e29" />
              </linearGradient>

              <pattern
                id="grassStripes"
                width="72"
                height="72"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(14)"
              >
                <rect
                  width="36"
                  height="72"
                  fill="rgb(255 255 255 / 3%)"
                />
                <rect
                  x="36"
                  width="36"
                  height="72"
                  fill="rgb(0 0 0 / 3%)"
                />
              </pattern>

              <filter id="treeShadow">
                <feDropShadow
                  dx="0"
                  dy="5"
                  stdDeviation="4"
                  floodColor="#07140e"
                  floodOpacity="0.5"
                />
              </filter>

              <clipPath id="fieldFan">
                <path
                  d="
                    M 450 590
                    L 90 275
                    Q 145 85 450 55
                    Q 755 85 810 275
                    Z
                  "
                />
              </clipPath>
            </defs>

            {/* Card background */}
            <rect
              width="900"
              height="620"
              fill="url(#fieldBackground)"
            />

            {/* Main field */}
            <g clipPath="url(#fieldFan)">
              <rect
                x="55"
                y="35"
                width="790"
                height="570"
                fill="url(#fieldGrass)"
              />

              <rect
                x="55"
                y="35"
                width="790"
                height="570"
                fill="url(#grassStripes)"
              />

              {/* Infield dirt */}
              <circle
                cx="450"
                cy="420"
                r="165"
                fill="url(#infieldDirt)"
              />

              {/* Infield grass */}
              <polygon
                points="
                  450,314
                  563,420
                  450,530
                  337,420
                "
                fill="#315e3c"
              />

              {/* Base paths */}
              <polyline
                points="
                  450,530
                  337,420
                  450,314
                  563,420
                  450,530
                "
                fill="none"
                stroke="rgb(230 204 163 / 55%)"
                strokeWidth="20"
                strokeLinejoin="round"
              />

              {/* Foul lines */}
              <line
                x1="450"
                y1="565"
                x2="90"
                y2="275"
                stroke="#efe8cf"
                strokeOpacity="0.88"
                strokeWidth="3"
              />

              <line
                x1="450"
                y1="565"
                x2="810"
                y2="275"
                stroke="#efe8cf"
                strokeOpacity="0.88"
                strokeWidth="3"
              />

              {/* Pitcher's mound */}
              <ellipse
                cx="450"
                cy="420"
                rx="34"
                ry="24"
                fill="#a47449"
                stroke="#dbc6a0"
                strokeOpacity="0.55"
                strokeWidth="2"
              />

              <rect
                x="438"
                y="417"
                width="24"
                height="5"
                rx="2"
                fill="#efe8cf"
              />
            </g>

            {/* Outfield wall */}
            <path
              d="
                M 90 275
                Q 145 85 450 55
                Q 755 85 810 275
              "
              fill="none"
              stroke="#8d754d"
              strokeWidth="7"
            />

            <path
              d="
                M 90 275
                Q 145 85 450 55
                Q 755 85 810 275
              "
              fill="none"
              stroke="#192b1f"
              strokeWidth="3"
            />

            {/* Trees across outfield */}
            <g filter="url(#treeShadow)">
              {[
                [95, 216, 42],
                [130, 150, 50],
                [175, 112, 46],
                [225, 85, 56],
                [285, 67, 46],
                [350, 54, 58],
                [420, 48, 48],
                [485, 53, 55],
                [550, 62, 48],
                [615, 83, 57],
                [680, 115, 50],
                [738, 155, 54],
                [790, 216, 43],
              ].map(([cx, cy, r], index) => (
                <g key={index}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="#183c23"
                  />
                  <circle
                    cx={cx - r * 0.25}
                    cy={cy - r * 0.15}
                    r={r * 0.62}
                    fill="#285b2e"
                  />
                  <circle
                    cx={cx + r * 0.2}
                    cy={cy - r * 0.2}
                    r={r * 0.52}
                    fill="#336b36"
                  />
                  <rect
                    x={cx - 4}
                    y={cy + r * 0.55}
                    width="8"
                    height={r * 0.75}
                    fill="#543b24"
                  />
                </g>
              ))}
            </g>

            {/* Left-side bleachers */}
            <g transform="translate(90 330) rotate(12)">
              <rect
                x="0"
                y="0"
                width="105"
                height="205"
                fill="#252d28"
                stroke="#756e5e"
                strokeWidth="3"
              />

              {Array.from({ length: 9 }).map((_, index) => (
                <rect
                  key={index}
                  x="10"
                  y={12 + index * 20}
                  width="85"
                  height="8"
                  fill="url(#bleacherMetal)"
                />
              ))}

              <rect
                x="-8"
                y="195"
                width="121"
                height="28"
                fill="#4e473a"
              />
            </g>

            {/* Left dugout */}
            <g transform="translate(150 260) rotate(12)">
              <rect
                width="92"
                height="58"
                fill="#1a2521"
                stroke="#7b725e"
                strokeWidth="2"
              />
              <polygon
                points="0,0 92,0 78,-20 12,-20"
                fill="url(#roofGreen)"
                stroke="#83775d"
                strokeWidth="2"
              />
            </g>

            {/* Right-side building / covered bleachers */}
            <g transform="translate(675 350) rotate(-20)">
              <rect
                x="0"
                y="0"
                width="145"
                height="235"
                fill="#27322d"
                stroke="#665f51"
                strokeWidth="3"
              />

              <rect
                x="12"
                y="18"
                width="121"
                height="200"
                fill="url(#roofGreen)"
                stroke="#817761"
                strokeWidth="2"
              />

              {Array.from({ length: 8 }).map((_, index) => (
                <line
                  key={index}
                  x1={25 + index * 14}
                  y1="20"
                  x2={25 + index * 14}
                  y2="216"
                  stroke="#647d71"
                  strokeWidth="2"
                  opacity="0.7"
                />
              ))}
            </g>

            {/* Right-side trees */}
            <g filter="url(#treeShadow)">
              {[
                [760, 300, 38],
                [790, 330, 45],
                [820, 365, 44],
                [790, 410, 48],
                [750, 440, 42],
              ].map(([cx, cy, r], index) => (
                <g key={index}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="#193c24"
                  />
                  <circle
                    cx={cx - 10}
                    cy={cy - 10}
                    r={r * 0.62}
                    fill="#2b5d30"
                  />
                  <circle
                    cx={cx + 11}
                    cy={cy - 7}
                    r={r * 0.48}
                    fill="#386d38"
                  />
                </g>
              ))}
            </g>

            {/* Home plate dirt */}
            <circle
              cx="450"
              cy="550"
              r="44"
              fill="#9d7047"
              opacity="0.95"
            />

            {/* Batter's boxes */}
            <rect
              x="417"
              y="530"
              width="18"
              height="34"
              fill="none"
              stroke="#efe8cf"
              strokeOpacity="0.7"
              strokeWidth="2"
            />

            <rect
              x="465"
              y="530"
              width="18"
              height="34"
              fill="none"
              stroke="#efe8cf"
              strokeOpacity="0.7"
              strokeWidth="2"
            />

            {/* Center field marker */}
            <text
              x="450"
              y="150"
              textAnchor="middle"
              fill="rgb(239 232 207 / 60%)"
              fontSize="18"
              fontWeight="700"
              letterSpacing="4"
            >
              CF
            </text>

            {/* Light poles */}
            <g>
              <line
                x1="135"
                y1="320"
                x2="118"
                y2="205"
                stroke="#7e826f"
                strokeWidth="4"
              />
              <circle
                cx="116"
                cy="198"
                r="11"
                fill="#d8d4be"
              />

              <line
                x1="685"
                y1="495"
                x2="698"
                y2="395"
                stroke="#7e826f"
                strokeWidth="4"
              />
              <circle
                cx="700"
                cy="388"
                r="11"
                fill="#d8d4be"
              />
            </g>
          </svg>

          {/* Interactive bases */}
          <FieldBase
            occupied={bases.second}
            label="2B"
            className="
              left-1/2 top-[50.5%]
              -translate-x-1/2 -translate-y-1/2
            "
          />

          <FieldBase
            occupied={bases.third}
            label="3B"
            className="
              left-[37.5%] top-[68%]
              -translate-x-1/2 -translate-y-1/2
            "
          />

          <FieldBase
            occupied={bases.first}
            label="1B"
            className="
              left-[62.5%] top-[68%]
              -translate-x-1/2 -translate-y-1/2
            "
          />

          <div
            className="
              absolute bottom-[5.5%] left-1/2 z-20
              flex h-8 w-9 -translate-x-1/2 items-center
              justify-center bg-scoreboard-cream font-heading
              text-[9px] font-bold text-scoreboard-dark
              [clip-path:polygon(0_0,100%_0,100%_58%,50%_100%,0_58%)]
            "
          >
            H
          </div>

          {/* Legend */}
          <div className="ballpark-legend absolute bottom-3 right-3 hidden space-y-2 sm:block">
            <div className="ballpark-legend-row">
              <span className="size-3 rounded-full bg-scoreboard-amber shadow-[0_0_8px_rgb(218_170_61/75%)]" />
              Runner on base
            </div>

            <div className="ballpark-legend-row">
              <span className="size-3 rounded-full border border-scoreboard-cream/70 bg-scoreboard-dark" />
              Base empty
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
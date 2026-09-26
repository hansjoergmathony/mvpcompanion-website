import { frameworkContent } from "@/content/homepage";

const NAVY = "#0b1f3a";
const BLUE = "#1a56db";
const TEAL = "#128a73";
const FONT = "inherit";

const chain = frameworkContent.qualityPrinciple.chain;
const caption = chain.join(" → ");

export function TraceabilityDiagram() {
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <div className="md:hidden">
        <VerticalChain />
      </div>
      <div className="hidden md:block">
        <HorizontalChain />
      </div>
    </figure>
  );
}

function HorizontalChain() {
  const width = 1200;
  const height = 72;
  const slot = width / chain.length;
  const midY = 36;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      className="block h-auto w-full"
      role="img"
      aria-label={caption}
    >
      {chain.map((item, index) => {
        const x = slot * index + slot / 2;
        const isLast = index === chain.length - 1;
        const lines = splitLabel(item);

        return (
          <g key={item}>
            <text
              x={x}
              y={lines.length === 1 ? midY : midY - 8}
              textAnchor="middle"
              fill={isLast ? TEAL : NAVY}
              fontFamily={FONT}
              fontSize="14"
              fontWeight="600"
              letterSpacing="-0.02em"
            >
              {lines.map((line, lineIndex) => (
                <tspan
                  key={line}
                  x={x}
                  dy={lineIndex === 0 ? 0 : 16}
                >
                  {line}
                </tspan>
              ))}
            </text>
            {isLast ? null : (
              <text
                x={slot * (index + 1)}
                y={midY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={BLUE}
                fontFamily={FONT}
                fontSize="14"
                fontWeight="500"
              >
                →
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function VerticalChain() {
  const width = 320;
  const row = 48;
  const height = 16 + chain.length * row;
  const cx = width / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      className="block h-auto w-full"
      role="img"
      aria-label={caption}
    >
      {chain.map((item, index) => {
        const y = 20 + index * row;
        const isLast = index === chain.length - 1;

        return (
          <g key={item}>
            <text
              x={cx}
              y={y}
              textAnchor="middle"
              fill={isLast ? TEAL : NAVY}
              fontFamily={FONT}
              fontSize="15"
              fontWeight="600"
              letterSpacing="-0.02em"
            >
              {item}
            </text>
            {isLast ? null : (
              <text
                x={cx}
                y={y + 24}
                textAnchor="middle"
                fill={BLUE}
                fontFamily={FONT}
                fontSize="14"
                fontWeight="500"
              >
                ↓
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function splitLabel(item: string) {
  if (item === "Acceptance Criterion") {
    return ["Acceptance", "Criterion"];
  }

  return [item];
}

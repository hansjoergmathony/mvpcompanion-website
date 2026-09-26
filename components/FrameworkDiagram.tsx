import { frameworkContent } from "@/content/homepage";

const NAVY = "#0b1f3a";
const BLUE = "#1a56db";
const TEAL = "#128a73";
const BORDER = "#d5deea";
const FONT = "inherit";

export function FrameworkDiagram() {
  return (
    <figure className="mt-10">
      <figcaption className="sr-only">{frameworkContent.structure}</figcaption>
      <div className="sm:hidden">
        <FrameworkSvg
          idPrefix="framework-narrow"
          viewBoxWidth={360}
          viewBoxHeight={500}
          layout="stacked"
        />
      </div>
      <div className="hidden sm:block">
        <FrameworkSvg
          idPrefix="framework-wide"
          viewBoxWidth={960}
          viewBoxHeight={400}
          layout="split"
        />
      </div>
    </figure>
  );
}

function FrameworkSvg({
  idPrefix,
  viewBoxWidth,
  viewBoxHeight,
  layout,
}: {
  idPrefix: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  layout: "split" | "stacked";
}) {
  const cx = viewBoxWidth / 2;
  const specFill = `${idPrefix}-spec`;
  const spineFill = `${idPrefix}-spine`;
  const arrowId = `${idPrefix}-arrow`;

  const split = layout === "split";

  const leftX = split ? 240 : cx;
  const rightX = split ? 720 : cx;
  const plusY = split ? 52 : 118;
  const sourceTop = split ? 16 : 12;
  const sourceBottom = split ? 88 : 100;
  const stackedRightTop = 136;
  const stackedRightBottom = 224;
  const afterSources = split ? sourceBottom : stackedRightBottom;
  const spine1Start = afterSources + 10;
  const spine1End = spine1Start + 28;
  const specY = spine1End + 8;
  const specH = split ? 118 : 108;
  const specX = split ? 80 : 16;
  const specW = viewBoxWidth - specX * 2;
  const spine2Start = specY + specH + 8;
  const spine2End = spine2Start + 28;
  const outcomeY = spine2End + 22;
  const dimensionsY = outcomeY + 36;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      className="block h-auto w-full"
      role="img"
      aria-label={frameworkContent.structure}
    >
      <defs>
        <linearGradient id={specFill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.05" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={spineFill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} />
          <stop offset="100%" stopColor={TEAL} />
        </linearGradient>
        <marker
          id={arrowId}
          markerWidth="7"
          markerHeight="7"
          refX="3.5"
          refY="3.5"
          orient="auto"
        >
          <path d="M 0 0 L 7 3.5 L 0 7 z" fill={TEAL} />
        </marker>
      </defs>

      <SourceBlock
        x={leftX}
        top={sourceTop}
        bottom={split ? sourceBottom : 100}
        width={split ? 400 : 328}
        eyebrow={frameworkContent.method.focus}
        title={frameworkContent.method.name}
      />

      {split ? null : (
        <text
          x={cx}
          y={plusY}
          textAnchor="middle"
          dominantBaseline="central"
          fill={BLUE}
          fontFamily={FONT}
          fontSize="26"
          fontWeight="500"
        >
          +
        </text>
      )}

      <SourceBlock
        x={rightX}
        top={split ? sourceTop : stackedRightTop}
        bottom={split ? sourceBottom : stackedRightBottom}
        width={split ? 400 : 328}
        eyebrow={frameworkContent.process.focus}
        title={frameworkContent.process.name}
      />

      {split ? (
        <text
          x={cx}
          y={plusY}
          textAnchor="middle"
          dominantBaseline="central"
          fill={BLUE}
          fontFamily={FONT}
          fontSize="28"
          fontWeight="500"
        >
          +
        </text>
      ) : null}

      <Spine
        x={cx}
        y1={spine1Start}
        y2={spine1End}
        gradientId={spineFill}
        markerId={arrowId}
      />

      <rect
        x={specX}
        y={specY}
        width={specW}
        height={specH}
        fill={`url(#${specFill})`}
        stroke="rgba(26,86,219,0.2)"
        strokeWidth="1"
      />
      <text
        x={cx}
        y={specY + (split ? 48 : 42)}
        textAnchor="middle"
        fill={NAVY}
        fontFamily={FONT}
        fontSize={split ? 28 : 22}
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        {frameworkContent.spec.name}
      </text>
      <line
        x1={cx - (split ? 160 : 110)}
        y1={specY + (split ? 68 : 60)}
        x2={cx + (split ? 160 : 110)}
        y2={specY + (split ? 68 : 60)}
        stroke={BORDER}
        strokeWidth="1"
      />
      <text
        x={cx}
        y={specY + (split ? 94 : 86)}
        textAnchor="middle"
        fill={NAVY}
        fontFamily={FONT}
        fontSize="13"
        fontWeight="500"
      >
        <tspan>{frameworkContent.method.focus}</tspan>
        <tspan fill={BLUE} dx="12">
          +
        </tspan>
        <tspan dx="12">{frameworkContent.process.focus}</tspan>
      </text>

      <Spine
        x={cx}
        y1={spine2Start}
        y2={spine2End}
        gradientId={spineFill}
        markerId={arrowId}
      />

      <text
        x={cx}
        y={outcomeY}
        textAnchor="middle"
        fill={TEAL}
        fontFamily={FONT}
        fontSize="11"
        fontWeight="500"
        letterSpacing="0.18em"
      >
        {frameworkContent.outcome.label.toUpperCase()}
      </text>
      {frameworkContent.outcome.dimensions.map((dimension, index) => {
        const count = frameworkContent.outcome.dimensions.length;
        const spread = split ? 220 : 200;
        const x = cx + (index - (count - 1) / 2) * (spread / (count - 1));

        return (
          <text
            key={dimension}
            x={x}
            y={dimensionsY}
            textAnchor="middle"
            fill={NAVY}
            fontFamily={FONT}
            fontSize="13"
            fontWeight="500"
          >
            {dimension}
          </text>
        );
      })}
    </svg>
  );
}

function SourceBlock({
  x,
  top,
  bottom,
  width,
  eyebrow,
  title,
}: {
  x: number;
  top: number;
  bottom: number;
  width: number;
  eyebrow: string;
  title: string;
}) {
  const half = width / 2;

  return (
    <g>
      <line
        x1={x - half}
        y1={top}
        x2={x + half}
        y2={top}
        stroke={BORDER}
        strokeWidth="1"
      />
      <text
        x={x}
        y={top + 24}
        textAnchor="middle"
        fill={BLUE}
        fontFamily={FONT}
        fontSize="11"
        fontWeight="500"
        letterSpacing="0.18em"
      >
        {eyebrow.toUpperCase()}
      </text>
      <text
        x={x}
        y={top + 52}
        textAnchor="middle"
        fill={NAVY}
        fontFamily={FONT}
        fontSize="18"
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        {title}
      </text>
      <line
        x1={x - half}
        y1={bottom}
        x2={x + half}
        y2={bottom}
        stroke={BORDER}
        strokeWidth="1"
      />
    </g>
  );
}

function Spine({
  x,
  y1,
  y2,
  gradientId,
  markerId,
}: {
  x: number;
  y1: number;
  y2: number;
  gradientId: string;
  markerId: string;
}) {
  return (
    <line
      x1={x}
      y1={y1}
      x2={x}
      y2={y2}
      stroke={`url(#${gradientId})`}
      strokeWidth="1"
      markerEnd={`url(#${markerId})`}
    />
  );
}

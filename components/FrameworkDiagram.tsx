import type { Dictionary } from "@/content/en";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const NAVY = "#0b1f3a";
const BLUE = "#1a56db";
const TEAL = "#128a73";
const BORDER = "#d5deea";
const FONT = "inherit";

export async function FrameworkDiagram() {
  const { frameworkContent: content } = await getDictionary();

  return (
    <figure className="mt-10">
      <figcaption className="sr-only">{content.structure}</figcaption>
      <div className="sm:hidden">
        <FrameworkSvg
          content={content}
          idPrefix="framework-narrow"
          viewBoxWidth={360}
          viewBoxHeight={510}
          layout="stacked"
        />
      </div>
      <div className="hidden sm:block">
        <FrameworkSvg
          content={content}
          idPrefix="framework-wide"
          viewBoxWidth={960}
          viewBoxHeight={420}
          layout="split"
        />
      </div>
    </figure>
  );
}

function FrameworkSvg({
  content,
  idPrefix,
  viewBoxWidth,
  viewBoxHeight,
  layout,
}: {
  content: Dictionary["frameworkContent"];
  idPrefix: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
  layout: "split" | "stacked";
}) {
  const split = layout === "split";
  const cx = viewBoxWidth / 2;
  const specFill = `${idPrefix}-spec`;
  const spineFill = `${idPrefix}-spine`;

  const sourceWidth = split ? 290 : 328;
  const sourceHeight = split ? 104 : 82;
  const leftX = split ? 260 : cx;
  const rightX = split ? 700 : cx;
  const leftTop = 18;
  const leftBottom = leftTop + sourceHeight;
  const rightTop = split ? leftTop : 146;
  const rightBottom = rightTop + sourceHeight;
  const plusY = split ? leftTop + sourceHeight / 2 : 124;

  const mergeY = split ? 178 : rightBottom + 38;
  const specY = split ? 218 : 300;
  const specH = split ? 122 : 112;
  const specW = split ? 560 : 328;
  const specX = cx - specW / 2;
  const postSpecStart = specY + specH + 12;
  const postSpecEnd = postSpecStart + 34;
  const outcomeY = postSpecEnd + 30;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      className="block h-auto w-full"
      role="img"
      aria-label={content.structure}
    >
      <defs>
        <linearGradient id={specFill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.08" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={spineFill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} />
          <stop offset="100%" stopColor={TEAL} />
        </linearGradient>
      </defs>

      <SourceBlock
        x={leftX}
        top={leftTop}
        width={sourceWidth}
        height={sourceHeight}
        eyebrow={content.method.focus}
        title={content.method.name}
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
      ) : (
        <>
          <Spine
            x={cx}
            y1={leftBottom + 8}
            y2={rightTop - 9}
          />
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
        </>
      )}

      <SourceBlock
        x={rightX}
        top={rightTop}
        width={sourceWidth}
        height={sourceHeight}
        eyebrow={content.process.focus}
        title={content.process.name}
      />

      {split ? (
        <>
          <RoundedMerge
            leftX={leftX}
            rightX={rightX}
            sourceBottom={leftBottom}
            mergeY={mergeY}
            centerX={cx}
            gradientId={spineFill}
          />
          <Spine
            x={cx}
            y1={mergeY}
            y2={specY - 14}
          />
        </>
      ) : (
        <Spine
          x={cx}
          y1={rightBottom + 10}
          y2={specY - 14}
        />
      )}

      <SpecBlock
        content={content}
        x={specX}
        y={specY}
        width={specW}
        height={specH}
        centerX={cx}
        fillId={specFill}
        compact={!split}
      />

      <Spine
        x={cx}
        y1={postSpecStart}
        y2={postSpecEnd}
      />
      <text
        x={cx}
        y={outcomeY}
        textAnchor="middle"
        fill={TEAL}
        fontFamily={FONT}
        fontSize={split ? "12" : "10"}
        fontWeight="600"
        letterSpacing="0.15em"
      >
        {content.outcome.label.toUpperCase()}
      </text>
    </svg>
  );
}

function SourceBlock({
  x,
  top,
  width,
  height,
  eyebrow,
  title,
}: {
  x: number;
  top: number;
  width: number;
  height: number;
  eyebrow: string;
  title: string;
}) {
  return (
    <g>
      <rect
        x={x - width / 2}
        y={top}
        width={width}
        height={height}
        rx="14"
        fill="#ffffff"
        stroke="rgba(26,86,219,0.25)"
        strokeWidth="1"
      />
      <text
        x={x}
        y={top + height / 2 - 12}
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
        y={top + height / 2 + 19}
        textAnchor="middle"
        fill={NAVY}
        fontFamily={FONT}
        fontSize="18"
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        {title}
      </text>
    </g>
  );
}

function RoundedMerge({
  leftX,
  rightX,
  sourceBottom,
  mergeY,
  centerX,
  gradientId,
}: {
  leftX: number;
  rightX: number;
  sourceBottom: number;
  mergeY: number;
  centerX: number;
  gradientId: string;
}) {
  const radius = 28;

  return (
    <g
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={`M ${leftX} ${sourceBottom} V ${mergeY - radius} Q ${leftX} ${mergeY} ${leftX + radius} ${mergeY} H ${centerX}`}
      />
      <path
        d={`M ${rightX} ${sourceBottom} V ${mergeY - radius} Q ${rightX} ${mergeY} ${rightX - radius} ${mergeY} H ${centerX}`}
      />
    </g>
  );
}

function SpecBlock({
  content,
  x,
  y,
  width,
  height,
  centerX,
  fillId,
  compact,
}: {
  content: Dictionary["frameworkContent"];
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  fillId: string;
  compact: boolean;
}) {
  const titleY = y + height / 2 - 15;
  const dividerY = y + height / 2 + 6;
  const subtitleY = y + height / 2 + 32;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="16"
        fill={`url(#${fillId})`}
        stroke="rgba(26,86,219,0.24)"
        strokeWidth="1"
      />
      <text
        x={centerX}
        y={titleY}
        textAnchor="middle"
        fill={NAVY}
        fontFamily={FONT}
        fontSize={compact ? "22" : "28"}
        fontWeight="600"
        letterSpacing="-0.02em"
      >
        {content.spec.name}
      </text>
      <line
        x1={centerX - (compact ? 108 : 160)}
        y1={dividerY}
        x2={centerX + (compact ? 108 : 160)}
        y2={dividerY}
        stroke={BORDER}
        strokeWidth="1"
      />
      <text
        x={centerX}
        y={subtitleY}
        textAnchor="middle"
        fill={NAVY}
        fontFamily={FONT}
        fontSize={compact ? "12" : "13"}
        fontWeight="500"
      >
        <tspan>{content.method.focus}</tspan>
        <tspan fill={BLUE} dx="12">
          +
        </tspan>
        <tspan dx="12">{content.process.focus}</tspan>
      </text>
    </g>
  );
}

function Spine({
  x,
  y1,
  y2,
}: {
  x: number;
  y1: number;
  y2: number;
}) {
  const arrowHeight = 7;
  const arrowHalfWidth = 4;

  return (
    <g>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2 - arrowHeight}
        stroke={TEAL}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d={`M ${x - arrowHalfWidth} ${y2 - arrowHeight} H ${x + arrowHalfWidth} L ${x} ${y2} Z`}
        fill={TEAL}
      />
    </g>
  );
}

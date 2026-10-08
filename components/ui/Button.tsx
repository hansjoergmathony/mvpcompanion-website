"use client";

import type { ReactNode } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";

type Variant = "primary" | "secondary" | "inverse" | "inverseSecondary";

type SharedButtonProps = {
  children: ReactNode;
  variant?: Variant;
};

type LinkButtonProps = SharedButtonProps & {
  href: string;
};

type NativeButtonProps = SharedButtonProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

function isLinkButton(
  props: LinkButtonProps | NativeButtonProps,
): props is LinkButtonProps {
  return typeof props.href === "string";
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const variant = props.variant ?? "primary";

  if (isLinkButton(props)) {
    const className = getButtonClassName(variant);
    const isInternal = props.href.startsWith("/") || props.href.startsWith("#");

    if (isInternal) {
      return (
        <LocaleLink href={props.href} className={className}>
          {props.children}
        </LocaleLink>
      );
    }

    return (
      <a href={props.href} className={className}>
        {props.children}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={getButtonClassName(variant, props.disabled)}
    >
      {props.children}
    </button>
  );
}

function getButtonClassName(variant: Variant, disabled?: boolean) {
  const variantClassName = {
    primary:
      "border border-blue bg-blue text-white hover:bg-blue-bright hover:border-blue-bright",
    secondary:
      "border border-border bg-card text-navy hover:border-navy/25",
    inverse:
      "border border-white bg-white text-navy hover:bg-ice",
    inverseSecondary:
      "border border-white/30 bg-transparent text-white hover:border-white/60",
  }[variant];

  return `inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${variantClassName} ${
    disabled ? "cursor-not-allowed opacity-50 hover:bg-blue hover:border-blue" : ""
  }`;
}

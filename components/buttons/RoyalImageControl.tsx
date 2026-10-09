"use client";

import { useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import Image from "next/image";
import styles from "./RoyalImageControl.module.css";

export type ButtonAsset =
  | "add-to-calendar" | "back-to-beginning" | "contact-us"
  | "gallery-close" | "gallery-next" | "gallery-previous"
  | "learn-more" | "save-our-date-default" | "save-our-date-focus"
  | "save-our-date-hover" | "save-our-date-mobile" | "save-our-date-press"
  | "save-our-date-primary" | "view-directions" | "view-photos";

type VisualState = "rest" | "hover" | "pressed" | "focus";
type Tone = "primary" | "secondary" | "quiet";
type ArtworkOptions = {
  label: string;
  asset: ButtonAsset;
  mobileAsset?: ButtonAsset;
  hoverAsset?: ButtonAsset;
  pressedAsset?: ButtonAsset;
  focusAsset?: ButtonAsset;
  tone?: Tone;
  className?: string;
};

// All artwork remains in user-owned PNGs. Dimensions are the original
// verified IHDR values, used only to preserve aspect ratio.
const dimensions: Record<ButtonAsset, readonly [number, number]> = {
  "add-to-calendar": [1874, 472],
  "back-to-beginning": [1804, 433],
  "contact-us": [1943, 489],
  "gallery-close": [510, 600],
  "gallery-next": [513, 597],
  "gallery-previous": [513, 594],
  "learn-more": [1372, 390],
  "save-our-date-default": [2068, 514],
  "save-our-date-focus": [1128, 435],
  "save-our-date-hover": [2013, 554],
  "save-our-date-mobile": [1683, 495],
  "save-our-date-press": [1920, 467],
  "save-our-date-primary": [2068, 514],
  "view-directions": [1992, 451],
  "view-photos": [1780, 414],
};

function useArtState() {
  const [state, setState] = useState<VisualState>("rest");
  return {
    state,
    events: {
      onPointerEnter: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") setState("hover");
      },
      onPointerLeave: () => setState("rest"),
      onPointerDown: () => setState("pressed"),
      onPointerUp: (e: React.PointerEvent) =>
        setState(e.pointerType === "mouse" ? "hover" : "rest"),
      onPointerCancel: () => setState("rest"),
      onFocus: () => setState("focus"),
      onBlur: () => setState("rest"),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") setState("pressed");
      },
      onKeyUp: (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") setState("focus");
      },
    },
  };
}

const assetUrl = (file: ButtonAsset) => "/heritage/buttons/" + file + ".png";

function Art({ asset, mobileAsset, hoverAsset, pressedAsset, focusAsset, state, label }: ArtworkOptions & {
  state: VisualState;
}) {
  const file = state === "pressed" ? (pressedAsset ?? asset)
    : state === "focus" ? (focusAsset ?? asset)
    : state === "hover" ? (hoverAsset ?? asset)
    : asset;
  const [width, height] = dimensions[file];
  const [baseWidth, baseHeight] = dimensions[asset];
  return (
    <span className={styles.art} style={{ aspectRatio: baseWidth / baseHeight }}>
      <picture>
        {mobileAsset && (
          <source
            media="(max-width: 640px)"
            srcSet={assetUrl(state === "rest" ? mobileAsset : file)}
          />
        )}
        <Image
          src={assetUrl(file)}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          sizes="(max-width: 640px) 90vw, 380px"
          quality={85}
          className={styles.png}
          draggable={false}
          fetchPriority="auto"
        />
      </picture>
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}

type RoyalLinkProps = ArtworkOptions &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "aria-label"> & {
    dataGatewayReveal?: string;
  };

export function RoyalImageLink({
  label, asset, mobileAsset, hoverAsset, pressedAsset, focusAsset, tone = "secondary",
  className = "", dataGatewayReveal, ...rest
}: RoyalLinkProps) {
  const { state, events } = useArtState();
  return (
    <a {...rest} {...events} aria-label={label}
      data-gateway-reveal={dataGatewayReveal}
      data-tone={tone}
      className={[styles.control, className].filter(Boolean).join(" ")}
    >
      <Art {...{ label, asset, mobileAsset, hoverAsset, pressedAsset, focusAsset, tone }} state={state} />
    </a>
  );
}

type RoyalButtonProps = ArtworkOptions &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

export function RoyalImageButton({
  label, asset, mobileAsset, hoverAsset, pressedAsset, focusAsset, tone = "primary",
  className = "", type = "button", ...rest
}: RoyalButtonProps) {
  const { state, events } = useArtState();
  return (
    <button {...rest} {...events} aria-label={label} type={type}
      data-tone={tone}
      className={[styles.control, className].filter(Boolean).join(" ")}
    >
      <Art {...{ label, asset, mobileAsset, hoverAsset, pressedAsset, focusAsset, tone }} state={state} />
    </button>
  );
}

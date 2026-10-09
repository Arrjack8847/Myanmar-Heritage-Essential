import Image from "next/image";

type Props = {
  scene: "journey" | "blessing";
  skyClassName: string;
  mistClassName: string;
};

/**
 * Reuse the exact original Bagan pagoda and golden mist cutouts in both
 * chapters instead of adding separate raster exports or heavy video smoke.
 * The parent section controls positioning and scroll parallax.
 */
export default function HeritageAtmosphere({ scene, skyClassName, mistClassName }: Props) {
  return (
    <>
      <div
        className={skyClassName}
        data-journey-atmosphere={scene === "journey" ? "sky" : undefined}
        data-blessing-layer={scene === "blessing" ? "sky" : undefined}
        aria-hidden="true"
      >
        <Image
          src="/heritage/bagan-pagodas.png"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 1140px"
          quality={72}
          loading="lazy"
          draggable={false}
        />
      </div>
      <div
        className={mistClassName}
        data-journey-atmosphere={scene === "journey" ? "mist" : undefined}
        data-blessing-layer={scene === "blessing" ? "mist" : undefined}
        aria-hidden="true"
      >
        <Image
          src="/heritage/golden-mist.png"
          alt=""
          fill
          sizes="100vw"
          quality={70}
          loading="lazy"
          draggable={false}
        />
      </div>
    </>
  );
}

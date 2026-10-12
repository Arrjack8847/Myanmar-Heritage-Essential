import Image from "next/image";
import styles from "./RoyalBlessing.module.css";

const ROOT = "/heritage/section5/";

type Decoration = {
  className: string;
  path: string;
  width: number;
  height: number;
  sizes: string;
  motion: string;
};

const decorations: Decoration[] = [
  { className: styles.pavilionArch, path: "01_Architecture/01_royal_arch_top.png", width: 3136, height: 1750, sizes: "(max-width: 640px) 140vw, 1050px", motion: "arch" },
  { className: styles.pavilionPillarLeft, path: "01_Architecture/02_royal_pillar_left.png", width: 1200, height: 2910, sizes: "(max-width: 640px) 132px, 315px", motion: "pillar-left" },
  { className: styles.pavilionPillarRight, path: "01_Architecture/03_royal_pillar_right.png", width: 1200, height: 2529, sizes: "(max-width: 640px) 132px, 315px", motion: "pillar-right" },
  { className: styles.pavilionSilk, path: "02_Fabric/05_flowing_ivory_silk.png", width: 2123, height: 1400, sizes: "(max-width: 640px) 132vw, 850px", motion: "silk" },
  { className: styles.pavilionFlowerLeft, path: "03_Flowers/06_floral_top_left.png", width: 1800, height: 1554, sizes: "(max-width: 640px) 175px, 310px", motion: "flower-left" },
  { className: styles.pavilionFlowerRight, path: "03_Flowers/07_floral_top_right.png", width: 1758, height: 1800, sizes: "(max-width: 640px) 175px, 310px", motion: "flower-right" },
  { className: styles.pavilionGarlandLeft, path: "03_Flowers/08_jasmine_garland_left.png", width: 750, height: 2271, sizes: "(max-width: 640px) 65px, 112px", motion: "garland-left" },
  { className: styles.pavilionGarlandRight, path: "03_Flowers/09_jasmine_garland_right.png", width: 750, height: 1344, sizes: "(max-width: 640px) 65px, 112px", motion: "garland-right" },
  { className: styles.pavilionPendant, path: "04_Ornaments/10_hanging_lotus_pendant.png", width: 900, height: 1235, sizes: "(max-width: 640px) 80px, 130px", motion: "pendant" },
];

const foreground: Decoration[] = [
  { className: styles.pavilionBoat, path: "05_Scenery/15_river_boat_foreground.png", width: 735, height: 800, sizes: "(max-width: 640px) 132px, 230px", motion: "boat" },
  { className: styles.pavilionRail, path: "01_Architecture/04_golden_balustrade.png", width: 2710, height: 1000, sizes: "(max-width: 640px) 96vw, 930px", motion: "rail" },
  { className: styles.pavilionLotusLeft, path: "03_Flowers/13_lotus_cluster_left.png", width: 1800, height: 1876, sizes: "(max-width: 640px) 220px, 360px", motion: "lotus-left" },
  { className: styles.pavilionLotusRight, path: "03_Flowers/14_lotus_cluster_right.png", width: 1733, height: 2000, sizes: "(max-width: 640px) 220px, 360px", motion: "lotus-right" },
];

function Layer({ item }: { item: Decoration }) {
  return (
    <div className={item.className} data-pavilion={item.motion}>
      <Image src={ROOT + item.path} alt="" width={item.width} height={item.height}
        sizes={item.sizes} loading="lazy" draggable={false} />
    </div>
  );
}

/** All scenery is decorative; the actual wedding content stays in normal HTML flow. */
export default function RoyalPavilionArtwork() {
  return (
    <div className={styles.pavilionArtwork} aria-hidden="true">
      <div className={styles.pavilionScene} data-pavilion="scene">
        <Image src={ROOT + "05_Scenery/16_bagan_sunset_background.png"}
          alt="" fill sizes="100vw" quality={76} loading="lazy"
          className={styles.pavilionLandscape} />
        <div className={styles.pavilionSunHaze} />
        {foreground.map(item => <Layer key={item.motion} item={item} />)}
      </div>
      <div className={styles.pavilionTop}>
        {decorations.map(item => <Layer key={item.motion} item={item} />)}
      </div>
      <div className={styles.pavilionPetals} data-pavilion="petals">
        <Image src={ROOT + "03_Flowers/12_floating_petals.png"} alt=""
          width={2400} height={897} sizes="(max-width: 640px) 78vw, 620px" loading="lazy" />
      </div>
    </div>
  );
}

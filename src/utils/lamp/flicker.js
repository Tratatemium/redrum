import gsap from "gsap";
import { VARIANTS, applyVariant } from "./lamp-variants";

function createFlicker(lamp) {
  const cfg = {
    baseVariant:
      VARIANTS[lamp.el.components["lamp"].data.variant] ?? VARIANTS.normal,
    repeatDelay: 0.8,
    randomizeDelay: true,
  };

  let tl = null;

  return {
    normal() {
      tl?.kill();
      gsap.to({
        duration: 0.2,
        onUpdate() {
          applyVariant(lamp, VARIANTS.normal);
        },
      });
    },
    off() {
      tl?.kill();
      gsap.to({
        duration: 0.2,
        onUpdate() {
          applyVariant(lamp, VARIANTS.off);
        },
      });
    },

    flicker(duration = 5) {
      tl?.kill();

      const baseIntensity = cfg.baseVariant.light.intensity ?? 1;
      const endTime = gsap.ticker.time + duration;

      const proxy = { v: baseIntensity };
      const setLight = () =>
        applyVariant(lamp, {
          ...cfg.baseVariant,
          light: { ...cfg.baseVariant.light, intensity: proxy.v },
        });

      tl = gsap.timeline({
        repeat: -1,
        repeatDelay: cfg.randomizeDelay
          ? cfg.repeatDelay + Math.random() * 0.8
          : cfg.repeatDelay,
        onRepeat() {
          if (gsap.ticker.time >= endTime) {
            tl.kill();
            applyVariant(lamp, cfg.baseVariant);
            return;
          }
          tl.repeatDelay(cfg.repeatDelay + Math.random() * 0.8);
        },
      });
      tl.to(proxy, {
        v: 0.1,
        duration: 0.04,
        onUpdate: setLight,
      })
        .to(proxy, {
          v: 1.4,
          duration: 0.04,
          onUpdate: setLight,
        })
        .to(proxy, {
          v: 0,
          duration: 0.03,
          onUpdate: setLight,
        })
        .to(proxy, {
          v: 1.6,
          duration: 0.07,
          onUpdate: setLight,
        })
        .to(proxy, {
          v: 0.3,
          duration: 0.04,
          onUpdate: setLight,
        })
        .to(proxy, {
          v: baseIntensity,
          duration: 0.1,
          onUpdate: setLight,
        });
    },
  };
}

export { createFlicker };

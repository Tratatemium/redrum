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
  let pendingCall = null;

  function killAll() {
    tl?.kill();
    pendingCall?.kill();
    tl = null;
    pendingCall = null;
  }

  return {
    normal() {
      killAll();
      gsap.to({
        duration: 0.2,
        onUpdate() {
          applyVariant(lamp, VARIANTS.normal);
        },
      });
    },
    off() {
      killAll();
      gsap.to({
        duration: 0.2,
        onUpdate() {
          applyVariant(lamp, VARIANTS.off);
        },
      });
    },

    flicker(duration = 5) {
      killAll();

      const baseIntensity = cfg.baseVariant.light.intensity ?? 1;
      const endTime = gsap.ticker.time + duration;

      function runCycle() {
        const proxy = { v: baseIntensity };
        const setLight = () =>
          applyVariant(lamp, {
            ...cfg.baseVariant,
            light: { ...cfg.baseVariant.light, intensity: proxy.v },
          });

        tl = gsap.timeline({
          onComplete() {
            applyVariant(lamp, VARIANTS.off);
            if (gsap.ticker.time >= endTime) {
              applyVariant(lamp, cfg.baseVariant);
              return;
            }
            const delay = cfg.repeatDelay + Math.random() * 0.8;
            pendingCall = gsap.delayedCall(delay, runCycle);
          },
        });
        tl.to(proxy, { v: 0.1, duration: 0.05, onUpdate: setLight })
          .to(proxy, { v: 1.4, duration: 0.05, onUpdate: setLight })
          .to(proxy, { v: 0, duration: 0.04, onUpdate: setLight })
          .to(proxy, { v: 1.6, duration: 0.08, onUpdate: setLight })
          .to(proxy, { v: 0.3, duration: 0.04, onUpdate: setLight })
          .to(proxy, { v: baseIntensity, duration: 0.2, onUpdate: setLight });
      }

      runCycle();
    },
  };
}

export { createFlicker };

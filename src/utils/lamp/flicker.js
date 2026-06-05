import gsap from "gsap";
import { VARIANTS, applyVariant } from "./lamp-variants";

function createFlicker(lamp) {
  const cfg = {
    baseVariant:
      VARIANTS[lamp.el.components["lamp"].data.variant] ?? VARIANTS.normal,
    repeatDelay: 0.4,
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
      applyVariant(lamp, cfg.baseVariant);
    },
    off() {
      killAll();
      applyVariant(lamp, VARIANTS.off);
    },

    flicker(duration = 5) {
      killAll();

      const baseIntensity = cfg.baseVariant.light.intensity ?? 1;
      const CYCLE_DURATION = 0.46; // sum of all tween durations
      const endTime = gsap.ticker.time + duration;

      let resolve;
      const promise = new Promise((res) => {
        resolve = res;
      });

      function finish() {
        applyVariant(lamp, cfg.baseVariant);
        resolve();
      }

      function runCycle() {
        const proxy = { v: baseIntensity };
        const setLight = () => {
          const ratio = baseIntensity > 0 ? proxy.v / baseIntensity : 0;
          applyVariant(lamp, {
            ...cfg.baseVariant,
            emissiveIntensity: cfg.baseVariant.emissiveIntensity * ratio,
            light: { ...cfg.baseVariant.light, intensity: proxy.v },
          });
        };

        tl = gsap.timeline({
          onComplete() {
            applyVariant(lamp, VARIANTS.off);
            const remaining = endTime - gsap.ticker.time;
            const nextDelay = cfg.repeatDelay + Math.random() * 0.2;
            if (remaining < nextDelay + CYCLE_DURATION) {
              pendingCall = gsap.delayedCall(Math.max(0, remaining), finish);
              return;
            }
            pendingCall = gsap.delayedCall(nextDelay, runCycle);
          },
        });
        tl.to(proxy, { v: 0.1, duration: 0.05, onUpdate: setLight })
          .to(proxy, { v: 1.4, duration: 0.05, onUpdate: setLight })
          .to(proxy, { v: 0, duration: 0.04, onUpdate: setLight })
          .to(proxy, { v: 1.6, duration: 0.08, onUpdate: setLight })
          .to(proxy, { v: 0.3, duration: 0.04, onUpdate: setLight })
          .to(proxy, { v: baseIntensity, duration: 0.2, onUpdate: setLight });
      }

      const initialDelay =
        Math.random() *
        Math.min(cfg.repeatDelay, Math.max(0, duration - CYCLE_DURATION));
      pendingCall = gsap.delayedCall(initialDelay, runCycle);
      return promise;
    },
  };
}

export { createFlicker };

import { createFlicker } from "../lamp/flicker";
import gsap from "gsap";

function wait(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

function playSound(id, options = {}) {
  const el = document.getElementById(`sfx-${id}`);
  if (!el) return;

  const sound = el.components.sound;
  if (!sound) return;

  if (options.volume !== undefined) {
    sound.setVolume(options.volume);
  }

  if (options.playbackRate !== undefined) {
    sound.stopSound?.();
    el.setAttribute("sound", "playbackRate", options.playbackRate);
  }

  sound.playSound();
}

function setupTransition(component) {
  component._flickers = new Map();
  component.twins = document.querySelector("#twin-ghosts");
  const lamps = document.querySelectorAll("[lamp]");
  lamps.forEach((lampEl) => {
    const lampComp = lampEl.components["lamp"];
    if (!lampComp) return;
    const flicker = createFlicker(lampComp);
    component._flickers.set(lampEl, flicker);
  });
  component.rig = document.querySelector("#player-rig");
  component.screen = document.querySelector("#player-screen");
  component.corridor = document.querySelector("[corridor-state]");
}

function flickerLights(component, s) {
  playSound("electrical");
  return Promise.all(
    [...component._flickers.values()].map((f) => f.flicker(s)),
  );
}

function lightsOff(component) {
  component._flickers.forEach((f) => f.off());
}

function lightsOn(component) {
  component._flickers.forEach((f) => f.normal());
}

async function doFirstTransition(component) {
  await flickerLights(component, 2);
  lightsOff(component);
  playSound("drop-to-dark");
  await wait(2);
  component._flickers.get(document.getElementById("twins-lamp")).normal();
  component.twins.setAttribute("visible", true);
  playSound("reverse-breath");
  await wait(3);
  await flickerLights(component, 1);
  component.twins.setAttribute("visible", false);
  component.corridor.components["corridor-state"].setState("decayed");
  await flickerLights(component, 1);
}

async function doSecondTransition(component) {
  await flickerLights(component, 2);
  lightsOn(component);
  component.rig.setAttribute("movement-controls", "enabled", false);
  playSound("freezing");
  component.screen.components["player-screen"].setColor("#EAF6FF", 0);
  component.screen.components["player-screen"].show(0.4);
  await component.screen.components["player-screen"].show(0.4);
  await wait(2);
  component.rig.setAttribute("movement-controls", "enabled", true);
  component.screen.components["player-screen"].hide(0.4);
  component.screen.components["player-screen"].setColor("#ffffff", 0);
  component.corridor.components["corridor-state"].setState("frosted");
  await flickerLights(component, 1);
}

export { setupTransition, doFirstTransition, doSecondTransition };

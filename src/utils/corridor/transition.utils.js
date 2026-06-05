import { createFlicker } from "../lamp/flicker";

function wait(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

function setupTransition(component) {
  component._flickers = new Map();
  const lamps = document.querySelectorAll("[lamp]");
  lamps.forEach((lampEl) => {
    const lampComp = lampEl.components["lamp"];
    if (!lampComp) return;
    const flicker = createFlicker(lampComp);
    component._flickers.set(lampEl, flicker);
  });
}

function flickerLights(component, s) {
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
  await wait(3);
  lightsOn(component);
  await wait(3);
  await flickerLights(component, 2);
}

export { setupTransition, doFirstTransition };

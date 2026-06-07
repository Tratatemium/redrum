const LAMP_TYPES = {
  ceiling: {
    model: "#lamp-ceiling",
    class: "lamp-ceiling",
    lights: [
      { pos: "0 -0.17 0", attributes: { intensity: 1.2, distance: 6 } },
    ],
  },
  wall: {
    model: "#lamp-wall",
    class: "lamp-wall",
    lights: [
      { pos: "0 0 0.13", attributes: { intensity: 0.5, distance: 1, decay: 2 } },
    ],
  },
  chandelier: {
    model: "#lamp-chandelier",
    class: "lamp-chandelier",
    lights: [
      { pos: "-0.2 1.96 0.34",  attributes: { intensity: 1, distance: 6, decay: 2} },
      { pos: "0.2 1.96 0.34",   attributes: { intensity: 1, distance: 6, decay: 2 } },
      { pos: "-0.37 1.96 0",    attributes: { intensity: 1, distance: 6, decay: 2 } },
      { pos: "0.2 1.96 -0.34",  attributes: { intensity: 1, distance: 6, decay: 2 } },
      { pos: "-0.38 1.96 0.01", attributes: { intensity: 1, distance: 6, decay: 2 } },
      { pos: "0.18 1.96 -0.34", attributes: { intensity: 1, distance: 6, decay: 2 } },
    ],
  },
};

function setLampType(lamp) {
  const selected = LAMP_TYPES[lamp.data.type];
  if (!selected) {
    console.warn(`lamp-types: Unknown lamp type "${lamp.data.type}"`);
    return;
  }

  lamp.el.setAttribute("gltf-model", selected.model);
  lamp.el.classList.add(selected.class);

  selected.lights.forEach(({ pos, attributes }) => {
    const lightEl = document.createElement("a-light");
    lamp.el.appendChild(lightEl);
    lightEl.setAttribute("position", pos);
    lightEl.setAttribute("light", { type: "point", ...attributes });
  });
}

export { LAMP_TYPES, setLampType };

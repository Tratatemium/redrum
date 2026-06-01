const LAMP_TYPES = {
  ceiling: {
    model: "#lamp-ceiling",
    class: "lamp-ceiling",
    lightPos: "0 -0.17 0",
    lightAttributes: {
      intensity: 1.2,
      distance: 6,
    },
  },
  wall: {
    model: "#lamp-wall",
    class: "lamp-wall",
    lightPos: "0 0 0.13",
    lightAttributes: { intensity: 0.5, distance: 1, decay: 2 },
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

  const light = lamp.el.querySelector("a-light");
  if (!light) {
    console.warn("lamp-types: No child a-light entity found!");
  } else {
    light.setAttribute("position", selected.lightPos);
    light.setAttribute("light", selected.lightAttributes);
  }
}

export { setLampType };

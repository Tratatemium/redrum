const variants = {
  locked: "red",
};

function updateLampColor(door) {
  const lamp = door.data.lamp;
  if (!lamp) return;

  const doorVariants = door.el.components["door-variants"];
  if (!doorVariants) return;

  lamp.setAttribute(
    "lamp",
    "variant",
    door.data.isLocked ? variants.locked : doorVariants.data.variant,
  );
}

export { updateLampColor };

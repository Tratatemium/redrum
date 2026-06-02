const variants = {
  closed: "red",
};

function updateLampColor(door) {
  const lamp = door.data.lamp;
  if (!lamp) return;

  lamp.setAttribute(
    "lamp",
    "variant",
    door.isOpen
      ? door.el.components["door-variants"].data.variant
      : variants.closed,
  );
}

export { updateLampColor };

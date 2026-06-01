const variants = {
  open: "normal",
  closed: "red",
};

function updateLampColor(door) {
  const lamp = door.data.lamp;
  if (!lamp) return;

  lamp.setAttribute(
    "lamp",
    "variant",
    door.isOpen ? variants.open : variants.closed,
  );
}

export { updateLampColor };

function createLight(lamp) {
  const light = document.createElement("a-light");

  light.setAttribute("light", {
    type: "point",
  });

  lamp.el.appendChild(light);
}

export { createLight };

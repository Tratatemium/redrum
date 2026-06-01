AFRAME.registerComponent("state-button", {
  schema: {
    state: { type: "string" },
    label: { type: "string" },
    color: { type: "color", default: "#444" },
  },

  init() {
    this.el.classList.add("clickable");

    this.el.setAttribute(
      "geometry",
      "primitive: box; width: 0.4; height: 0.15; depth: 0.05",
    );
    this.el.setAttribute("material", `color: ${this.data.color}`);

    const text = document.createElement("a-text");
    text.setAttribute("value", this.data.label || this.data.state);
    text.setAttribute("align", "center");
    text.setAttribute("position", "0 0 0.03");
    text.setAttribute("scale", "0.4 0.4 0.4");
    text.setAttribute("color", "#fff");
    this.el.appendChild(text);

    this.el.addEventListener("click", () => {
      const corridor = document.querySelector("[corridor-state]");
      if (!corridor) return;
      corridor.components["corridor-state"].setState(this.data.state);
    });
  },
});

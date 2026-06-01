import gsap from "gsap";

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
      "primitive: box; width: 0.44; height: 0.16; depth: 0.06; segmentsWidth: 1; segmentsHeight: 1",
    );
    this.el.setAttribute(
      "material",
      `color: ${this.data.color}; emissive: ${this.data.color}; emissiveIntensity: 0; roughness: 0.4; metalness: 0.5`,
    );

    // border / backing plate
    const border = document.createElement("a-entity");
    border.setAttribute(
      "geometry",
      "primitive: box; width: 0.46; height: 0.18; depth: 0.04",
    );
    border.setAttribute(
      "material",
      "color: #111; roughness: 0.8; metalness: 0.3",
    );
    border.setAttribute("position", "0 0 -0.01");
    this.el.appendChild(border);

    const text = document.createElement("a-text");
    text.setAttribute("value", this.data.label || this.data.state);
    text.setAttribute("align", "center");
    text.setAttribute("position", "0 0 0.035");
    text.setAttribute("scale", "0.38 0.38 0.38");
    text.setAttribute("color", "#ffffff");
    text.setAttribute("shader", "msdf");
    text.setAttribute("letter-spacing", "1");
    this.el.appendChild(text);

    const mesh = this.el.object3D;
    const mat = () => this.el.getObject3D("mesh")?.material;

    this.el.addEventListener("mousedown", () => {
      gsap.to(mesh.position, {
        z: mesh.position.z - 0.025,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(mat(), { emissiveIntensity: 0.6, duration: 0.1 });
    });

    this.el.addEventListener("mouseup", () => {
      gsap.to(mesh.position, {
        z: mesh.position.z + 0.025,
        duration: 0.15,
        ease: "power2.out",
      });
      gsap.to(mat(), { emissiveIntensity: 0, duration: 0.15 });
    });

    this.el.addEventListener("click", () => {
      const corridor = document.querySelector("[corridor-state]");
      if (!corridor) return;
      corridor.components["corridor-state"].setState(this.data.state);
    });
  },
});

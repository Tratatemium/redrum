const VARIANTS = {
  normal: {
    hex: 0xffffaa,
    emissiveIntensity: 6,
    light: { color: "#ffffaa", intensity: 1.2 },
  },
  red: {
    hex: 0xff0000,
    emissiveIntensity: 6,
    light: { color: "#ff0000", intensity: 1.2 },
  },
  off: {
    hex: 0xffffaa,
    emissiveIntensity: 0,
    light: { color: "#8A8568", intensity: 0 },
  },
};

const variantsKeys = Object.keys(VARIANTS);

AFRAME.registerComponent("lamp-controls", {
  init() {
    this.glassMaterial = null;
    this.lightEl = null;
    this._i = 0;

    this.el.addEventListener("model-loaded", () => {
      this.el.getObject3D("mesh").traverse((node) => {
        if (!node.isMesh) return;
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        const glass = materials.find((m) => m.name === "lamp_glass");
        if (glass) this.glassMaterial = glass;
      });

      this.lightEl = this.el.querySelector("a-light");
      if (!this.lightEl) {
        console.warn("lamp-controls: No child a-light entity found!");
      }
    });

    this.el.addEventListener("click", () => {
      if (!this.glassMaterial || !this.lightEl) return;

      this._i = (this._i + 1) % variantsKeys.length;
      const variant = VARIANTS[variantsKeys[this._i]];

      this.glassMaterial.color.setHex(variant.hex);
      this.glassMaterial.emissive.setHex(variant.hex);
      this.glassMaterial.emissiveIntensity = variant.emissiveIntensity;
      this.lightEl.setAttribute("light", variant.light);
    });
  },
});

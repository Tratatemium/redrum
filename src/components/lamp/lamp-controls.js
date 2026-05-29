const VARIANTS = {
  normal: {
    hex: 0xffffaa,
    emissiveIntensity: 6,
    light: { color: "#ffffaa" },
  },
  red: {
    hex: 0xff0000,
    emissiveIntensity: 6,
    light: { color: "#ff0000" },
  },
  off: {
    hex: 0xffffaa,
    emissiveIntensity: 0,
    light: { color: "#8A8568", intensity: 0 },
  },
};

const variantsKeys = Object.keys(VARIANTS);

AFRAME.registerComponent("lamp-controls", {
  schema: {
    variant: { type: "string", default: "normal" },
  },

  init() {
    this.glassMaterial = null;
    this.lightEl = null;
    this.baseIntensity = 1;
    this._i = Math.max(0, variantsKeys.indexOf(this.data.variant));

    this.el.addEventListener("model-loaded", () => {
      this.el.getObject3D("mesh").traverse((node) => {
        if (!node.isMesh) return;
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        const glass = materials.find((m) => m.name.startsWith("lamp_glass"));
        if (glass) this.glassMaterial = glass;
      });

      this.lightEl = this.el.querySelector("a-light");
      if (!this.lightEl) {
        console.warn("lamp-controls: No child a-light entity found!");
      } else {
        this.baseIntensity =
          this.lightEl.components?.light?.data?.intensity ?? this.baseIntensity;
      }

      const initial = VARIANTS[variantsKeys[this._i]];
      if (this.glassMaterial) {
        this.glassMaterial.color.setHex(initial.hex);
        this.glassMaterial.emissive.setHex(initial.hex);
        this.glassMaterial.emissiveIntensity = initial.emissiveIntensity;
      }
      if (this.lightEl) {
        const intensity =
          initial.emissiveIntensity === 0 ? 0 : this.baseIntensity;
        this.lightEl.setAttribute("light", { ...initial.light, intensity });
      }
    });

    this.el.addEventListener("click", () => {
      if (!this.glassMaterial || !this.lightEl) return;

      this._i = (this._i + 1) % variantsKeys.length;
      const variant = VARIANTS[variantsKeys[this._i]];

      this.glassMaterial.color.setHex(variant.hex);
      this.glassMaterial.emissive.setHex(variant.hex);
      this.glassMaterial.emissiveIntensity = variant.emissiveIntensity;
      const intensity =
        variant.emissiveIntensity === 0 ? 0 : this.baseIntensity;
      this.lightEl.setAttribute("light", { ...variant.light, intensity });
    });
  },
});

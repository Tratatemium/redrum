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
  decayed: {
    hex: 0xc8d27a,
    emissiveIntensity: 2.5,
    light: {
      color: "#b8c96a",
      intensity: 0.65,
    },
  },
  frosted: {
    hex: 0xdde8ff,
    emissiveIntensity: 4,
    light: {
      color: "#d6e6ff",
      intensity: 0.85,
    },
  },
  off: {
    hex: 0xffffaa,
    emissiveIntensity: 0,
    light: { color: "#8A8568", intensity: 0 },
  },
};

const variantsKeys = Object.keys(VARIANTS);

function handleVariants(lamp) {
  lamp.glassMaterial = null;
  lamp.lightEl = null;
  lamp.baseIntensity = 1;
  lamp._i = Math.max(0, variantsKeys.indexOf(lamp.data.variant));

  function applyVariant(variant) {
    const intensityMultiplier = variant.light.intensity ?? 1;
    const intensity =
      variant.emissiveIntensity === 0
        ? 0
        : lamp.baseIntensity * intensityMultiplier;

    if (lamp.glassMaterial) {
      lamp.glassMaterial.color.setHex(variant.hex);
      lamp.glassMaterial.emissive.setHex(variant.hex);
      lamp.glassMaterial.emissiveIntensity = variant.emissiveIntensity;
    }
    if (lamp.lightEl) {
      lamp.lightEl.setAttribute("light", { ...variant.light, intensity });
    }
  }

  lamp.el.addEventListener("model-loaded", () => {
    const mesh = lamp.el.getObject3D("mesh");
    if (!mesh) return;
    mesh.traverse((node) => {
      if (!node.isMesh) return;
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      const glass = materials.find((m) => m.name.startsWith("lamp_glass"));
      if (glass) lamp.glassMaterial = glass;
    });

    lamp.lightEl = lamp.el.querySelector("a-light");
    if (!lamp.lightEl) {
      console.warn("lamp: No child a-light entity found!");
    } else {
      lamp.baseIntensity =
        lamp.lightEl.components?.light?.data?.intensity ?? lamp.baseIntensity;
    }

    applyVariant(VARIANTS[variantsKeys[lamp._i]]);
  });

  lamp._updateVariant = () => {
    lamp._i = Math.max(0, variantsKeys.indexOf(lamp.data.variant));
    applyVariant(VARIANTS[variantsKeys[lamp._i]]);
  };

  lamp.el.addEventListener("click", () => {
    if (!lamp.glassMaterial || !lamp.lightEl) return;

    lamp._i = (lamp._i + 1) % variantsKeys.length;
    applyVariant(VARIANTS[variantsKeys[lamp._i]]);
  });
}

export { handleVariants };

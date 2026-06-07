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
    hex: 0x2a2a02,
    emissiveIntensity: 0,
    light: { color: "#8A8568", intensity: 0 },
  },
};

const variantsKeys = Object.keys(VARIANTS);

function applyVariant(lamp, variant) {
  const intensityMultiplier = variant.light.intensity ?? 1;
  const isOff = variant.emissiveIntensity === 0;
  const intensity = isOff ? 0 : lamp.baseIntensity * intensityMultiplier;

  if (lamp.glassMaterial) {
    lamp.glassMaterial.color.setHex(variant.hex);
    lamp.glassMaterial.emissive.setHex(variant.hex);
    lamp.glassMaterial.emissiveIntensity = variant.emissiveIntensity;
  }

  lamp.lightEls.forEach(lightEl => {
    lightEl.setAttribute("light", { ...variant.light, intensity });
  });

  lamp.el.emit("lamp-updated");
}

function handleVariants(lamp) {
  lamp.glassMaterial = null;
  lamp.lightEls = [];
  lamp.baseIntensity = 1;
  lamp._variantIndex = Math.max(0, variantsKeys.indexOf(lamp.data.variant));

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

    lamp.lightEls = [...lamp.el.querySelectorAll("a-light")];
    if (lamp.lightEls.length === 0) {
      console.warn("lamp: No child a-light entities found!");
    } else {
      lamp.baseIntensity =
        lamp.lightEls[0].components?.light?.data?.intensity ?? lamp.baseIntensity;
    }

    applyVariant(lamp, VARIANTS[variantsKeys[lamp._variantIndex]]);
  });

  lamp._updateVariant = () => {
    lamp._variantIndex = Math.max(0, variantsKeys.indexOf(lamp.data.variant));
    applyVariant(lamp, VARIANTS[variantsKeys[lamp._variantIndex]]);
  };

  lamp.el.addEventListener("click", () => {
    if (!lamp.glassMaterial || lamp.lightEls.length === 0) return;

    lamp._variantIndex = (lamp._variantIndex + 1) % variantsKeys.length;
    applyVariant(lamp, VARIANTS[variantsKeys[lamp._variantIndex]]);
  });
}

export { VARIANTS, applyVariant, handleVariants };

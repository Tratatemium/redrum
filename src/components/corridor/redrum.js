AFRAME.registerComponent("redrum", {
  schema: {
    variant: { type: "string", default: "normal" },
  },

  init() {
    const loader = new THREE.TextureLoader();
    this.textures = {
      normal: loader.load("/materials/corridor/Redrum_Normal.png"),
      decayed: loader.load("/materials/corridor/Redrum_Decayed.png"),
      frosted: loader.load("/materials/corridor/Redrum_Frosted.png"),
    };

    this.el.addEventListener("loaded", () => {
      this.mesh = this.el.getObject3D("mesh");
      this.updateTexture(this.mesh, this.textures[this.data.variant]);
    });
  },

  update(oldData) {
    if (oldData.variant === this.data.variant) return;
    if (!this.mesh) return;
    this.updateTexture(this.mesh, this.textures[this.data.variant]);
  },

  updateTexture(mesh, texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    if (!mesh.userData.materialCloned) {
      mesh.material = mesh.material.clone();
      mesh.userData.materialCloned = true;
    }
    mesh.material.map = texture;
    mesh.material.emissiveMap = texture;
    mesh.material.emissive.set(0x5c221a);
    mesh.material.emissiveIntensity = 4;
    mesh.material.transparent = true;
    mesh.material.alphaTest = 0.1;
    mesh.material.needsUpdate = true;
  },
});

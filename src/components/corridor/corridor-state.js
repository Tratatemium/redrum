AFRAME.registerComponent("corridor-state", {
  dependencies: ["corridor-textures"],
  init() {
    this.el.addEventListener("model-loaded", () => {
      this.model = this.el.getObject3D("mesh");

      this.meshes = {};
      this.model.traverse((node) => {
        if (node.isMesh) this.meshes[node.name] = node;
      });

      this.setState("normal");
    });
  },

  setState(state) {
    const textureComp = this.el.components["corridor-textures"];

    if (!textureComp || !textureComp.textures) {
      console.warn("corridor-textures component or textures not ready");
      return;
    }

    const textures = textureComp.textures;

    if (!textures[state]) {
      console.warn(`corridor-state: unknown state "${state}"`);
      return;
    }

    Object.values(this.meshes).forEach((mesh) => {
      if (!mesh.material) return;

      if (mesh.name.startsWith("Floor")) {
        const floorTexture = textures[state].floor;
        if (!floorTexture) {
          console.warn(`corridor-state: no floor texture for state "${state}"`);
          return;
        }
        if (!mesh.userData.materialCloned) {
          mesh.material = mesh.material.clone();
          mesh.userData.materialCloned = true;
        }
        mesh.material.map = floorTexture;
        mesh.material.needsUpdate = true;
      }
    });
  },
});

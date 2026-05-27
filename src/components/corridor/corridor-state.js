AFRAME.registerComponent("corridor-state", {
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
    console.log("setState", state, "meshes:", Object.keys(this.meshes));

    Object.values(this.meshes).forEach((mesh) => {
      if (!mesh.material) return;

      if (mesh.name.startsWith("Floor")) {
        if (!mesh.userData.materialCloned) {
          mesh.material = mesh.material.clone();
          mesh.userData.materialCloned = true;
        }
        mesh.material.map = textures[state].floor;
        mesh.material.needsUpdate = true;
      }
    });
  },
});

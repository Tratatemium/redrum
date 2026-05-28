import { updateTextures } from "../../utils/texture.utils";

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
    updateTextures(this, state);
  },
});

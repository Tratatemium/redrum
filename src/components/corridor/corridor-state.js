import { updateMaterials } from "../../utils/corridor/material.utils";

AFRAME.registerComponent("corridor-state", {
  dependencies: ["corridor-textures"],
  init() {
    this.el.addEventListener("model-loaded", () => {
      this.model = this.el.getObject3D("mesh");
      if (!this.model) return;

      this.meshes = {};
      this.model.traverse((node) => {
        if (node.isMesh) this.meshes[node.name] = node;
      });

      this.doors = this.el.querySelectorAll(".door");
      this.ceilingLamps = this.el.querySelectorAll(".lamp-ceiling");
      this.redrum = this.el.querySelector("#redrum");

      this.setState("normal");
    });
  },

  setState(state) {
    updateMaterials(this, state);
    this.doors.forEach((door) => {
      door.setAttribute("door-variants", "variant", state);
    });
    this.ceilingLamps.forEach((lamp) =>
      lamp.setAttribute("lamp", "variant", state),
    );
    this.redrum.setAttribute("redrum", "variant", state);
  },
});

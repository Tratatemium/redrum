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

      this.setState("frosted");
    });
  },

  setState(state) {
    updateMaterials(this, state);
    this.doors.forEach((door) => {
      const variant = state === "frosted" ? "frosted" : "normal";
      door.setAttribute("door-variants", "variant", variant);
      door.setAttribute("door", "variant", variant);
    });
    this.ceilingLamps.forEach((lamp) =>
      lamp.setAttribute("lamp", "variant", state),
    );
  },
});

import gsap from "gsap";
import { updateLampColor } from "../../utils/door.utils";

AFRAME.registerComponent("door", {
  schema: {
    lamp: { type: "selector" },
  },

  init() {
    this.el.setAttribute("gltf-model", "#door");
    this.el.classList.add("clickable");

    this.isOpen = false;
    updateLampColor(this);

    this.el.addEventListener("model-loaded", () => {
      this.door = this.el.object3D.getObjectByName("Door_M");
    });

    this.el.addEventListener("click", () => {
      if (!this.door) return;

      this.isOpen = !this.isOpen;
      updateLampColor(this);

      gsap.to(this.door.rotation, {
        y: this.isOpen ? -Math.PI / 1.8 : 0,
        duration: 1,
        ease: "power2.out",
      });
    });
  },
});

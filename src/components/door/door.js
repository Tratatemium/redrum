import gsap from "gsap";
import { updateLampColor } from "../../utils/door/door-lamp";

AFRAME.registerComponent("door", {
  schema: {
    lamp: { type: "selector" },
    isLocked: { type: "boolean", default: false },
  },

  init() {
    this.el.setAttribute("gltf-model", "#door");
    this.el.classList.add("door", "clickable", "collision");

    this.isOpen = false;
    updateLampColor(this);

    this.el.addEventListener("model-loaded", () => {
      this.door = this.el.object3D.getObjectByName("Door_M");
    });

    this.el.addEventListener("click", () => {
      if (!this.door) return;
      // if (this.data.isLocked) {
      //   SoundManager.playSoundOn("door-locked", this.el, { rolloffFactor: 2 });
      //   return;
      // }
      this.isOpen
        ? SoundManager.playSoundOn("door-open", this.el, { rolloffFactor: 2 })
        : SoundManager.playSoundOn("door-close", this.el, { rolloffFactor: 2 });

      this.isOpen = !this.isOpen;
      updateLampColor(this);
      this.el.classList.toggle("collision");

      gsap.to(this.door.rotation, {
        y: this.isOpen ? -Math.PI / 1.8 : 0,
        duration: 1,
        ease: "power2.out",
      });
    });
  },

  update(oldData) {
    if (
      oldData.isLocked !== undefined &&
      oldData.isLocked !== this.data.isLocked
    ) {
      updateLampColor(this);
    }
  },
});

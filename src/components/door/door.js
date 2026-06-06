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

    this.el.setAttribute("sound__open", {
      src: "#door-open",
      volume: 0.6,
      positional: true,
      rolloffFactor: 2,
    });

    this.el.setAttribute("sound__close", {
      src: "#door-close",
      volume: 0.6,
      positional: true,
      rolloffFactor: 2,
    });

    this.el.setAttribute("sound__locked", {
      src: "#door-locked",
      volume: 1,
      positional: true,
      rolloffFactor: 2,
    });

    this.isOpen = false;
    updateLampColor(this);

    this.el.addEventListener("model-loaded", () => {
      this.door = this.el.object3D.getObjectByName("Door_M");
    });

    this.el.addEventListener("click", () => {
      if (!this.door) return;
      if (this.data.isLocked) {
        this.el.components["sound__locked"].playSound();
        return;
      }
      if (!this.isOpen) this.el.components["sound__open"].playSound();
      else this.el.components["sound__close"].playSound();

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

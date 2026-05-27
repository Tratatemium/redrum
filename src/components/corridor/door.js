import gsap from "gsap";

AFRAME.registerComponent("door", {
  init() {
    this.isOpen = false;

    this.el.addEventListener("model-loaded", () => {
      this.door = this.el.object3D.getObjectByName("Door_M");
    });

    this.el.addEventListener("click", () => {
      if (!this.door) return;

      this.isOpen = !this.isOpen;

      gsap.to(this.door.rotation, {
        y: this.isOpen ? -Math.PI / 2 : 0,
        duration: 1,
        ease: "power2.out",
      });
    });
  },
});

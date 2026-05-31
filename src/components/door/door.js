import gsap from "gsap";

AFRAME.registerComponent("door", {
  init() {
    this.el.setAttribute("gltf-model", "#door");
    this.el.classList.add("clickable");
    this.isOpen = false;

    this.el.addEventListener("model-loaded", () => {
      this.door = this.el.object3D.getObjectByName("Door_M");
    });

    this.el.addEventListener("click", () => {
      if (!this.door) return;

      this.isOpen = !this.isOpen;

      gsap.to(this.door.rotation, {
        y: this.isOpen ? -Math.PI / 1.8 : 0,
        duration: 1,
        ease: "power2.out",
      });
    });
  },
});

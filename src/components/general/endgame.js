import gsap from "gsap";

AFRAME.registerComponent("endgame", {
  init() {
    const scene = this.el.sceneEl;
    const twins = document.querySelector("#twin-ghosts");
    const ambientLight = document.querySelector("[room-2-light]");
    const rig = document.querySelector("#player-rig");
    const screen = document.querySelector("#player-screen");

    let triggered = false;

    scene.addEventListener("trigger-enter", async (e) => {
      if (e.detail.id === "trigger-endgame" && !triggered) {
        triggered = true;
        twins.setAttribute("position", "35 0 -0.5");
        rig.setAttribute("movement-controls", "enabled", false);

        const materials = [];
        twins.object3D.traverse((node) => {
          if (node.isMesh) {
            node.material.transparent = true;
            node.material.opacity = 0;
            materials.push(node.material);
          }
        });
        twins.setAttribute("visible", true);

        const proxy = { opacity: 0, intensity: 0.05 };
        await gsap.to(proxy, {
          opacity: 1,
          intensity: 1,
          duration: 1.5,
          onUpdate() {
            materials.forEach((m) => (m.opacity = proxy.opacity));
            ambientLight?.setAttribute("intensity", proxy.intensity);
          },
        });

        screen.components["player-screen"].setColor("#EAF6FF", 0);
        // screen.components["player-screen"].show(0.4);
        await screen.components["player-screen"].show(1);
      }
    });
  },
});

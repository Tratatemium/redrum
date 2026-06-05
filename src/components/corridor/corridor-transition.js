AFRAME.registerComponent("corridor-transition", {
  dependencies: ["corridor-state"],
  init() {
    const corridor = document.querySelector("[corridor-state]");
    if (!corridor) return;
    console.log("mounted");

    const scene = this.el.sceneEl;
    scene.addEventListener("puzzle-1-solved", () => {
      corridor.components["corridor-state"].setState("decayed");
    });
    scene.addEventListener("puzzle-2-solved", () => {
      corridor.components["corridor-state"].setState("frosted");
    });
  },
});

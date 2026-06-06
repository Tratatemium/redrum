import {
  setupTransition,
  doFirstTransition,
} from "../../utils/corridor/transition.utils";

AFRAME.registerComponent("corridor-transition", {
  dependencies: ["corridor-state"],
  init() {
    const corridor = document.querySelector("[corridor-state]");
    const door2 = document.querySelector("#door-2");
    const door3 = document.querySelector("#door-3");
    if (!corridor) return;

    setupTransition(this);

    const scene = this.el.sceneEl;
    scene.addEventListener("puzzle-1-solved", async () => {
      await doFirstTransition(this);
      corridor.components["corridor-state"].setState("decayed");
      door2.setAttribute("door", "isLocked", false);
    });
    scene.addEventListener("puzzle-2-solved", () => {
      corridor.components["corridor-state"].setState("frosted");
    });
  },
});

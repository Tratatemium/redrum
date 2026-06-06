import {
  setupTransition,
  doFirstTransition,
  doSecondTransition,
} from "../../utils/corridor/transition.utils";

AFRAME.registerComponent("corridor-transition", {
  dependencies: ["corridor-state"],
  init() {
    this.state = {
      puzzle_1_solved: false,
      puzzle_2_solved: false,
      box_1_triggered: false,
      box_2_triggered: false,
    };

    const door2 = document.querySelector("#door-2");
    const door3 = document.querySelector("#door-3");
    const trigger1 = document.querySelector("#trigger-puzzle-1");
    const trigger2 = document.querySelector("#trigger-puzzle-2");
    const door3cover = document.querySelector("#door-3-cover");

    setupTransition(this);

    const scene = this.el.sceneEl;
    scene.addEventListener("puzzle-1-solved", () => {
      this.state.puzzle_1_solved = true;
    });
    scene.addEventListener("puzzle-2-solved", () => {
      this.state.puzzle_2_solved = true;
    });

    scene.addEventListener("trigger-enter", async (e) => {
      switch (e.detail.id) {
        case "trigger-puzzle-1": {
          if (this.state.puzzle_1_solved && !this.state.box_1_triggered) {
            this.state.box_1_triggered = true;
            await doFirstTransition(this);
            door2.setAttribute("door", "isLocked", false);
          }
          break;
        }

        case "trigger-puzzle-2": {
          if (this.state.puzzle_2_solved && !this.state.box_2_triggered) {
            this.state.box_2_triggered = true;
            await doSecondTransition(this);
            door3.setAttribute("door", "isLocked", false);
            door3cover.setAttribute("visible", false);
          }
          break;
        }

        default:
      }
    });
  },
});

import { isInsideEntity } from "./player-collision";

AFRAME.registerComponent("footstep-sounds", {
  init() {
    this.ready = false;
    this.lastPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();

    this.normalSteps = document.querySelector("#footsteps-normal");
    this.snowSteps = document.querySelector("#footsteps-snow");
    this.maze = document.querySelector("#maze-entity");
  },

  tick() {
    this.el.object3D.getWorldPosition(this.currentPosition);

    if (!this.ready) {
      this.lastPosition.copy(this.currentPosition);
      this.ready = true;
      return;
    }

    const moved = this.currentPosition.distanceTo(this.lastPosition) > 0.001;
    const inMaze = isInsideEntity(this.maze);
    const active = inMaze ? this.snowSteps : this.normalSteps;
    const inactive = inMaze ? this.normalSteps : this.snowSteps;

    if (!inactive.paused) inactive.pause();
    if (moved && active.paused) active.play();
    else if (!moved && !active.paused) active.pause();

    this.lastPosition.copy(this.currentPosition);
  },
});

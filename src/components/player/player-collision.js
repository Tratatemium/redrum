AFRAME.registerComponent("player-collision", {
  init() {
    this.playerBox = new THREE.Box3();
    this.tempBox = new THREE.Box3();
    this.lastPos = new THREE.Vector3();
    this.worldPos = new THREE.Vector3();
    this.playerSize = new THREE.Vector3(0.3, 1.6, 0.3);
    this.activeTriggers = new Set();
  },

  tick() {
    this.walls = document.querySelectorAll(".collision");
    this.triggers = document.querySelectorAll(".trigger-box");

    const player = this.el.object3D;
    const rig = this.el.parentEl.object3D;
    player.getWorldPosition(this.worldPos);
    this.playerBox.setFromCenterAndSize(this.worldPos, this.playerSize);

    let collided = false;
    for (const wall of this.walls) {
      this.tempBox.setFromObject(wall.object3D);
      if (!this.playerBox.intersectsBox(this.tempBox)) continue;

      collided = true;

      // Try sliding along Z (revert only X)
      const currentX = rig.position.x;
      const currentZ = rig.position.z;
      rig.position.x = this.lastPos.x;
      player.getWorldPosition(this.worldPos);
      this.playerBox.setFromCenterAndSize(
        this.worldPos,
        new THREE.Vector3(0.3, 1.6, 0.3),
      );
      if (!this.playerBox.intersectsBox(this.tempBox)) break;

      // Try sliding along X (revert only Z)
      rig.position.x = currentX;
      rig.position.z = this.lastPos.z;
      player.getWorldPosition(this.worldPos);
      this.playerBox.setFromCenterAndSize(
        this.worldPos,
        new THREE.Vector3(0.3, 1.6, 0.3),
      );
      if (!this.playerBox.intersectsBox(this.tempBox)) break;

      // Full stop — revert both axes
      rig.position.x = this.lastPos.x;
      rig.position.z = this.lastPos.z;
      break;
    }

    if (!collided) {
      this.lastPos.copy(rig.position);
    }

    for (const trigger of this.triggers) {
      this.tempBox.setFromObject(trigger.object3D);
      const inside = this.playerBox.intersectsBox(this.tempBox);
      const id = trigger.id;
      if (inside && !this.activeTriggers.has(id)) {
        this.activeTriggers.add(id);
        this.el.emit("trigger-enter", { id }, true);
      } else if (!inside && this.activeTriggers.has(id)) {
        this.activeTriggers.delete(id);
      }
    }
  },
});

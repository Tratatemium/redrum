AFRAME.registerComponent("player-collision", {
  init() {
    this.playerBox = new THREE.Box3();
    this.tempBox = new THREE.Box3();
    this.lastPos = new THREE.Vector3();
  },

  tick() {
    this.walls = [...document.querySelectorAll(".collision")];

    const player = this.el.object3D;
    const rig = this.el.parentEl.object3D;
    const worldPos = new THREE.Vector3();
    player.getWorldPosition(worldPos);
    this.playerBox.setFromCenterAndSize(
      worldPos,
      new THREE.Vector3(0.3, 1.6, 0.3),
    );

    let collided = false;
    for (const wall of this.walls) {
      this.tempBox.setFromObject(wall.object3D);
      if (!this.playerBox.intersectsBox(this.tempBox)) continue;

      collided = true;

      // Try sliding along Z (revert only X)
      const currentX = rig.position.x;
      const currentZ = rig.position.z;
      rig.position.x = this.lastPos.x;
      player.getWorldPosition(worldPos);
      this.playerBox.setFromCenterAndSize(
        worldPos,
        new THREE.Vector3(0.3, 1.6, 0.3),
      );
      if (!this.playerBox.intersectsBox(this.tempBox)) break;

      // Try sliding along X (revert only Z)
      rig.position.x = currentX;
      rig.position.z = this.lastPos.z;
      player.getWorldPosition(worldPos);
      this.playerBox.setFromCenterAndSize(
        worldPos,
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
  },
});

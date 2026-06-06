import AFRAME from "aframe"

AFRAME.registerComponent("footstep-sounds", {
    init() {
        this.lastPosition = new THREE.Vector3();
        this.currentPosition = new THREE.Vector3();
        this.audio = document.querySelector('#footsteps')
    },
    tick() {
        this.el.object3D.getWorldPosition(this.currentPosition);
        const moved = this.currentPosition.distanceTo(this.lastPosition) > 0.001

        if (moved && this.audio.paused) {
            this.audio.play().catch(() => { });
        } else if (!moved && !this.audio.paused) {
            this.audio.pause();
        }

        this.lastPosition.copy(this.currentPosition);
    }
})
import AFRAME from "aframe";

AFRAME.registerComponent("scene-trigger", {
    init() {
        this.playerPos = new THREE.Vector3();
        this.firstDone = false;
        this.secondDone = false;
    },

    tick() {
        if (this.firstDone && this.secondDone) return;

        this.el.object3D.getWorldPosition(this.playerPos);
        const z = this.playerPos.z;

        if (!this.firstDone && z < -4.5) {
            this.firstDone = true;
            document.querySelector("#char").setAttribute("visible", false);
        }

        if (!this.secondDone && z < -8.1) {
            this.secondDone = true;
            document.querySelector("#char2").setAttribute("visible", true);
            char2.components.sound.playSound();
        }
    },
});
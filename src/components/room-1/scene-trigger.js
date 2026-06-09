import AFRAME from "aframe";

AFRAME.registerComponent("scene-trigger", {
    init() {
        this.playerPos = new THREE.Vector3();
        this.firstDone = false;
        this.secondDone = false;
        this.char = document.querySelector("#char");
        this.char2 = document.querySelector("#char2");
    },

    tick() {
        if (this.firstDone && this.secondDone) return;

        this.el.object3D.getWorldPosition(this.playerPos);
        const z = this.playerPos.z;

        if (!this.firstDone && z < -4.5) {
            this.firstDone = true;
            this.char.setAttribute("visible", false);
        }

        if (!this.secondDone && z < -8.1) {
            this.secondDone = true;
            this.char2.setAttribute("animation-mixer", "clip: Armature|ArmatureAction; timeScale: 1");
            this.char2.setAttribute("visible", true);
            this.char2.components.sound.playSound();
        }
    },
});
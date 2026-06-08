import { isInsideEntity } from "../player/player-collision";

AFRAME.registerComponent("room-2-light", {
  init() {
    this.enteredRoom2 = false;
    this.room2 = document.querySelector("#room-2-entity");
    this.corridorLamps = document.querySelectorAll(".corridor-lamp a-light");
    this.savedLampAttrs = null;
  },

  tick() {
    const isInRoom2 = isInsideEntity(this.room2);

    if (isInRoom2 && !this.enteredRoom2) {
      this.enteredRoom2 = true;
      this.el.setAttribute("intensity", 0.5);

      this.savedLampAttrs = Array.from(this.corridorLamps).map((lamp) => {
        const light = lamp.getAttribute("light");
        return light ? { distance: light.distance, decay: light.decay } : null;
      });
      this.corridorLamps.forEach((lamp) => {
        lamp.setAttribute("light", { distance: 4, decay: 2 });
      });
    }

    if (!isInRoom2 && this.enteredRoom2) {
      this.enteredRoom2 = false;
      this.el.setAttribute("intensity", 0.05);

      if (this.savedLampAttrs) {
        this.corridorLamps.forEach((lamp, i) => {
          if (this.savedLampAttrs[i])
            lamp.setAttribute("light", this.savedLampAttrs[i]);
        });
        this.savedLampAttrs = null;
      }
    }
  },
});

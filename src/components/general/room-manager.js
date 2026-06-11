import { isInsideEntity } from "../player/player-collision";

AFRAME.registerComponent("room-manager", {
  init() {

    this.corridor = document.querySelector("#corridor-group");
    this.maze = document.querySelector("#maze-group");
    this.room1 = document.querySelector("#room-1-group");
    this.room2 = document.querySelector("#room-2-group");
    this.rooms = [this.corridor, this.maze, this.room1, this.room2];

    this.activeRoom = null;
    this.checkRoom = this.checkRoom.bind(this);

    this.ambientLight = document.querySelector("[room-2-light]");
    this.corridorLamps = document.querySelectorAll(".corridor-lamp a-light");
    this.savedLampAttrs = null;

    this.maze.pause();
    this.room1.pause();
    this.room2.pause();
  },

  tick() {
    this.checkRoom();
  },

  checkRoom() {
    let newActiveRoom = null;
    for (const room of this.rooms) {
      if (isInsideEntity(room)) {
        newActiveRoom = room;
        break;
      }
    }

    if (newActiveRoom === this.activeRoom) return;

    if (this.activeRoom) {
      this.deactivateRoom(this.activeRoom);
    }

    if (newActiveRoom) {
      this.activeRoom = newActiveRoom;
      this.activateRoom(newActiveRoom);
    }
  },

  activateRoom(room) {
    room.play();
    if (room === this.room2) {
      this.ambientLight?.setAttribute("intensity", 0.5);
      this.savedLampAttrs = Array.from(this.corridorLamps).map((lamp) => {
        const light = lamp.getAttribute("light");
        return light ? { distance: light.distance, decay: light.decay } : null;
      });
      this.corridorLamps.forEach((lamp) => {
        lamp.setAttribute("light", { distance: 4, decay: 2 });
      });
    }
  },

  deactivateRoom(room) {
    room.pause();
    if (room === this.room2) {
      this.ambientLight?.setAttribute("intensity", 0.05);
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

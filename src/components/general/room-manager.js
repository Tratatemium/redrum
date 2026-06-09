import { isInsideEntity } from "../player/player-collision";

AFRAME.registerComponent("room-manager", {
  init() {
    // console.log("mounted");

    this.corridor = document.querySelector("#corridor-group");
    this.maze = document.querySelector("#maze-group");
    this.room1 = document.querySelector("#room-1-group");
    this.room2 = document.querySelector("#room-2-group");
    this.rooms = [this.corridor, this.maze, this.room1, this.room2];

    this.activeRoom = null;
    this.checkRoom = this.checkRoom.bind(this);

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

    // console.log(`now in room ${newActiveRoom.id}`);

    if (this.activeRoom) {
      this.deactivateRoom(this.activeRoom);
    }

    if (newActiveRoom) {
      this.activeRoom = newActiveRoom;
      this.activateRoom(newActiveRoom);
    }
  },

  activateRoom(room) {
    // console.log(`${room.id} playing`);
    room.play();
  },

  deactivateRoom(room) {
    // console.log(`${room.id} paused`);
    room.pause();
  },
});

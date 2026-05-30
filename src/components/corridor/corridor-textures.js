AFRAME.registerComponent("corridor-textures", {
  init() {
    const loader = new THREE.TextureLoader();

    this.textures = {
      normal: {
        floor: {
          texture: loader.load("/materials/corridor/Floor_Normal.png"),
          name: "Floor",
        },
        wall: {
          texture: loader.load("/materials/corridor/Wall_Normal.png"),
          name: "Wall",
        },
        ceiling: {
          texture: loader.load("/materials/corridor/Ceiling_Normal.png"),
          name: "Ceiling",
        },
      },
      decayed: {
        floor: {
          texture: loader.load("/materials/corridor/Floor_Decayed.png"),
          name: "Floor",
        },
        wall: {
          texture: loader.load("/materials/corridor/Wall_Decayed.png"),
          name: "Wall",
        },
        ceiling: {
          texture: loader.load("/materials/corridor/Ceiling_Decayed.png"),
          name: "Ceiling",
        },
      },
    };

    Object.values(this.textures.normal).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    });
  },
});

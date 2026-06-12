AFRAME.registerComponent("corridor-textures", {
  init() {
    const loader = new THREE.TextureLoader();

    this.textures = {
      normal: {
        floor: {
          texture: loader.load("/materials/corridor/Floor_Normal.jpg"),
          name: "Floor",
        },
        wall: {
          texture: loader.load("/materials/corridor/Wall_Normal.jpg"),
          name: "Wall",
        },
        ceiling: {
          texture: loader.load("/materials/corridor/Ceiling_Normal.jpg"),
          name: "Ceiling",
        },
        baseboard: {
          texture: loader.load("/materials/corridor/Baseboard_Normal.jpg"),
          name: "Baseboard",
        },
      },
      decayed: {
        floor: {
          texture: loader.load("/materials/corridor/Floor_Decayed.jpg"),
          name: "Floor",
        },
        wall: {
          texture: loader.load("/materials/corridor/Wall_Decayed.jpg"),
          name: "Wall",
        },
        ceiling: {
          texture: loader.load("/materials/corridor/Ceiling_Decayed.jpg"),
          name: "Ceiling",
        },
        baseboard: {
          texture: loader.load("/materials/corridor/Baseboard_Normal.jpg"),
          name: "Baseboard",
        },
      },
      frosted: {
        floor: {
          texture: loader.load("/materials/corridor/Floor_Frosted.jpg"),
          name: "Floor",
        },
        wall: {
          texture: loader.load("/materials/corridor/Wall_Frosted.jpg"),
          name: "Wall",
        },
        ceiling: {
          texture: loader.load("/materials/corridor/Ceiling_Frosted.jpg"),
          name: "Ceiling",
        },
        baseboard: {
          texture: loader.load("/materials/corridor/Baseboard_Frosted.jpg"),
          name: "Baseboard",
        },
      },
    };

    Object.values(this.textures.normal).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    });
  },
});

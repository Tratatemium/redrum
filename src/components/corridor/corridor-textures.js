AFRAME.registerComponent("corridor-textures", {
  init() {
    const loader = new THREE.TextureLoader();

    this.textures = {
      normal: {
        floor: loader.load("/materials/corridor/Floor_Normal_2.png"),
        baseboard: loader.load("/materials/corridor/Baseboard_Normal.png"),
      },
    };

    Object.values(this.textures.normal).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    });
  },
});

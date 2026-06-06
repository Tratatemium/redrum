import { updateLampColor } from "../../utils/door/door-lamp";

AFRAME.registerComponent("door-variants", {
  schema: {
    variant: { type: "string", default: "normal" },
  },

  init() {
    const loader = new THREE.TextureLoader();
    this.textures = {
      normal: {
        door: loader.load("/materials/corridor/Door_Normal.png"),
        frame: loader.load("/materials/corridor/Frame_Normal.png"),
      },
      decayed: {
        door: loader.load("/materials/corridor/Door_Normal.png"),
        frame: loader.load("/materials/corridor/Frame_Normal.png"),
      },
      frosted: {
        door: loader.load("/materials/corridor/Door_Frosted.png"),
        frame: loader.load("/materials/corridor/Frame_Frosted.png"),
      },
    };

    updateLampColor(this.el.components["door"]);

    this.el.addEventListener("model-loaded", () => {
      this.door = this.el.object3D.getObjectByName("Door_M");
      this.frame = this.el.object3D.getObjectByName("Frame");
      this.updateTexture(this.door, this.textures[this.data.variant].door);
      this.updateTexture(this.frame, this.textures[this.data.variant].frame);
    });
  },

  update(oldData) {
    if (oldData.variant === this.data.variant) return;
    if (!this.door) return;
    this.updateTexture(this.door, this.textures[this.data.variant].door);
    this.updateTexture(this.frame, this.textures[this.data.variant].frame);
    updateLampColor(this.el.components["door"]);
  },

  updateTexture(mesh, texture) {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    if (!mesh.userData.materialCloned) {
      mesh.material = mesh.material.clone();
      mesh.userData.materialCloned = true;
    }
    mesh.material.map = texture;
    mesh.material.needsUpdate = true;
  },
});

function getTextures(component, state) {
  const textureComp = component.el.components["corridor-textures"];
  if (!textureComp || !textureComp.textures) {
    console.warn("corridor-textures component or textures not ready");
    return;
  }
  const textures = textureComp.textures[state];
  if (!textures) {
    console.warn(`corridor-state: unknown state "${state}"`);
    return;
  } else return textures;
}

function updateTexture(mesh, textures, state) {
  Object.entries(textures).forEach(([key, value]) => {
    if (mesh.name.startsWith(value.name)) {
      const texture = textures[key].texture;
      if (!texture) {
        console.warn(`corridor-state: no ${key} texture for state "${state}"`);
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      if (!mesh.userData.materialCloned) {
        mesh.material = mesh.material.clone();
        mesh.userData.materialCloned = true;
      }
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
    }
  });
}

function updateMaterials(component, state) {
  const textures = getTextures(component, state);

  Object.values(component.meshes).forEach((mesh) => {
    if (!mesh.material) return;
    updateTexture(mesh, textures, state);
  });
}

export { updateMaterials };

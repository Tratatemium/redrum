function updateTextures(component, state) {
  const textureComp = component.el.components["corridor-textures"];

  if (!textureComp || !textureComp.textures) {
    console.warn("corridor-textures component or textures not ready");
    return;
  }

  const textures = textureComp.textures;

  if (!textures[state]) {
    console.warn(`corridor-state: unknown state "${state}"`);
    return;
  }

  Object.values(component.meshes).forEach((mesh) => {
    if (!mesh.material) return;

    Object.entries(textures[state]).forEach(([key, value]) => {
      if (mesh.name.startsWith(value.name)) {
        const texture = textures[state][key].texture;
        if (!texture) {
          console.warn(
            `corridor-state: no ${key} texture for state "${state}"`,
          );
          return;
        }
        if (!mesh.userData.materialCloned) {
          mesh.material = mesh.material.clone();
          mesh.userData.materialCloned = true;
        }
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
    });
  });
}

export { updateTextures };

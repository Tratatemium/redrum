AFRAME.registerComponent("sound-manager", {
  schema: {
    masterVolume: { type: "number", default: 1 },
    sfxVolume: { type: "number", default: 1 },
    musicVolume: { type: "number", default: 1 },
    muted: { type: "boolean", default: false },
  },

  init() {
    window.SoundManager = this;
  },

  playOn(soundId, targetEl, options = {}) {
    const compName = `sound__${soundId}`;
    targetEl.setAttribute(compName, {
      src: `#${soundId}`,
      positional: true,
      ...options,
    });
    targetEl.components[compName].playSound();
  },

  stopOn(soundId, targetEl) {
    targetEl.components[`sound__${soundId}`]?.stopSound();
  },

  // --- internals ---

  _effectiveVolume(volume, type) {
    if (this.data.muted) return 0;
    return type === "sfx"
      ? volume * this.data.masterVolume * this.data.sfxVolume
      : volume * this.data.masterVolume * this.data.musicVolume;
  },
});

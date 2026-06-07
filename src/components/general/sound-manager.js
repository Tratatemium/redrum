AFRAME.registerComponent("sound-manager", {
  schema: {
    masterVolume: { type: "number", default: 1 },
    sfxVolume: { type: "number", default: 1 },
    musicVolume: { type: "number", default: 1 },
    muted: { type: "boolean", default: false },
  },

  init() {
    window.SoundManager = this;
    this.audioMap = {};
    const audioEl = document.querySelector("#audio");

    document.querySelectorAll("a-assets audio").forEach((el) => {
      const soundId = el.id;
      const emitterId = `${soundId}_emitter`;
      const emitterEl = document.createElement("a-entity");
      emitterEl.id = emitterId;
      emitterEl.setAttribute("sound", {
        src: `#${soundId}`,
      });
      audioEl.appendChild(emitterEl);

      this.audioMap[soundId] = emitterEl;
    });
  },

  playSoundOn(soundId, targetEl, options = {}) {
    const compName = `sound__${soundId}`;
    targetEl.setAttribute(compName, {
      src: `#${soundId}`,
      positional: true,
      ...options,
    });
    targetEl.components[compName].playSound();
  },

  stopSoundOn(soundId, targetEl) {
    targetEl.components[`sound__${soundId}`]?.stopSound();
  },

  playSound(soundId) {
    const emitterEl = this.audioMap[soundId];
    emitterEl?.components.sound.playSound();
  },

  stopSound(soundId) {
    const emitterEl = this.audioMap[soundId];
    emitterEl?.components.sound.stopSound();
  },

  // --- internals ---

  _effectiveVolume(volume, type) {
    if (this.data.muted) return 0;
    return type === "sfx"
      ? volume * this.data.masterVolume * this.data.sfxVolume
      : volume * this.data.masterVolume * this.data.musicVolume;
  },
});

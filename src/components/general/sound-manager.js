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
        positional: false,
      });
      audioEl.appendChild(emitterEl);

      this.audioMap[soundId] = emitterEl;
    });
  },

  playSoundOn(
    soundId,
    targetEl,
    options = {
      volume: 1,
      distanceModel: "linear",
      rolloffFactor: 1.5,
      maxDistance: 20,
    },
  ) {
    const compName = `sound__${soundId}`;
    const volume = this._effectiveVolume(options.volume ?? 1, soundId);
    targetEl.setAttribute(compName, {
      src: `#${soundId}`,
      positional: true,
      ...options,
      volume,
    });
    targetEl.components[compName].playSound();
  },

  isPlayingOn(soundId, targetEl) {
    targetEl.components[`sound__${soundId}`]?.isPlaying;
  },

  stopSoundOn(soundId, targetEl) {
    targetEl.components[`sound__${soundId}`]?.stopSound();
  },

  playSound(soundId, options = { volume: 1 }) {
    const emitterEl = this.audioMap[soundId];
    if (!emitterEl) return;
    const volume = this._effectiveVolume(options.volume ?? 1, soundId);
    emitterEl.setAttribute("sound", { ...options, volume });
    emitterEl.components.sound.playSound();
  },

  isPlaying(soundId) {
    const emitterEl = this.audioMap[soundId];
    return emitterEl?.components.sound.isPlaying;
  },

  stopSound(soundId) {
    const emitterEl = this.audioMap[soundId];
    emitterEl?.components.sound.stopSound();
  },

  // --- internals ---

  _effectiveVolume(volume, soundId) {
    if (this.data.muted) return 0;
    return soundId.startsWith("music_")
      ? volume * this.data.masterVolume * this.data.musicVolume
      : volume * this.data.masterVolume * this.data.sfxVolume;
  },
});

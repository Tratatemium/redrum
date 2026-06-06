import AFRAME from "aframe";
import gsap from "gsap";

/**
 * player-screen component
 *
 * Attach to #player-screen to control color, texture and visibility.
 *
 * Schema:
 *   color      {string}  – CSS color of the overlay
 *   src        {string}  – asset selector or URL for a texture (empty = no texture)
 *   opacity    {number}  – 0 (transparent) → 1 (fully opaque)
 *   duration   {number}  – default fade duration in seconds
 *
 * Public API (call via el.components['player-screen'].<method>):
 *   setColor(color, duration?)   – fade to a new color
 *   setTexture(src, duration?)   – swap texture (cross-fades via opacity)
 *   clearTexture(duration?)      – remove texture, revert to color
 *   show(duration?)              – fade in (opacity → 1)
 *   hide(duration?)              – fade out (opacity → 0)
 *   fadeTo(opacity, duration?)   – animate to any opacity value
 *
 * Scene events emitted:
 *   player-screen-shown   – after show() completes
 *   player-screen-hidden  – after hide() completes
 */

AFRAME.registerComponent("player-screen", {
  schema: {
    color: { type: "color", default: "#ffffff" },
    src: { type: "string", default: "" },
    opacity: { type: "number", default: 1 },
    duration: { type: "number", default: 0.6 },
  },

  init() {
    this._proxy = { opacity: this.data.opacity };
    this._applyMaterial();
    this.el.addEventListener("object3dset", () => this._enforceRenderOrder());
  },

  update(oldData) {
    const d = this.data;
    if (d.color !== oldData.color || d.src !== oldData.src) {
      this._applyMaterial();
    }
    if (d.opacity !== oldData.opacity) {
      this._setOpacity(d.opacity);
    }
  },

  // ─── internal helpers ────────────────────────────────────────────────────

  _enforceRenderOrder() {
    this._eachMaterial((m) => {
      m.depthTest = false;
      m.depthWrite = false;
      m.needsUpdate = true;
    });
  },

  _eachMaterial(fn) {
    const mesh = this.el.getObject3D("mesh");
    if (!mesh) return;
    mesh.traverse((node) => {
      if (!node.isMesh) return;
      node.renderOrder = 99999;
      const mats = Array.isArray(node.material)
        ? node.material
        : [node.material];
      mats.forEach(fn);
    });
  },

  _applyMaterial() {
    const { color, src, opacity } = this.data;
    const mat = {
      shader: "flat",
      color,
      opacity,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    };
    if (src) mat.src = src;
    this.el.setAttribute("material", mat);
    this._proxy.opacity = opacity;
  },

  _setOpacity(value) {
    this._eachMaterial((m) => {
      m.opacity = value;
      m.transparent = true;
      m.depthTest = false;
      m.depthWrite = false;
      m.needsUpdate = true;
    });
    this._proxy.opacity = value;
  },

  _animate(targetOpacity, duration) {
    return new Promise((resolve) => {
      gsap.to(this._proxy, {
        opacity: targetOpacity,
        duration,
        ease: "power2.inOut",
        onUpdate: () => this._setOpacity(this._proxy.opacity),
        onComplete: resolve,
      });
    });
  },

  // ─── public API ──────────────────────────────────────────────────────────

  /** Fade to a solid color */
  setColor(color, duration) {
    this.el.setAttribute("player-screen", "color", color);
    return new Promise((resolve) =>
      this.el.addEventListener("object3dset", resolve, { once: true }),
    );
  },

  /** Apply a texture src (asset selector like '#my-img' or a URL) */
  async setTexture(src, duration) {
    duration ??= this.data.duration;
    const prev = this._proxy.opacity;
    if (prev > 0) await this._animate(0, duration / 2);
    this.el.setAttribute("player-screen", "src", src);
    await this._animate(prev, duration / 2);
  },

  /** Remove texture and show plain color */
  async clearTexture(duration) {
    duration ??= this.data.duration;
    const prev = this._proxy.opacity;
    if (prev > 0) await this._animate(0, duration / 2);
    this.el.removeAttribute("material");
    this.el.setAttribute("player-screen", "src", "");
    this._applyMaterial();
    await this._animate(prev, duration / 2);
  },

  /** Animate opacity to any target value */
  async fadeTo(opacity, duration) {
    duration ??= this.data.duration;
    await this._animate(opacity, duration);
    this.el.setAttribute("player-screen", "opacity", opacity);
  },

  /** Fade in to fully opaque */
  async show(duration) {
    duration ??= this.data.duration;
    await this._animate(1, duration);
    this.el.setAttribute("player-screen", "opacity", 1);
    this.el.sceneEl.emit("player-screen-shown");
  },

  /** Fade out to fully transparent */
  async hide(duration) {
    duration ??= this.data.duration;
    await this._animate(0, duration);
    this.el.setAttribute("player-screen", "opacity", 0);
    this.el.sceneEl.emit("player-screen-hidden");
  },
});

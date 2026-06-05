import AFRAME from "aframe";

// Cap frame delta to avoid large position jumps after tab switches / stalls
const MAX_DELTA_MS = 50;

AFRAME.registerComponent("snow-particles", {
  schema: {
    count: { type: "int", default: 5000 },
    spread: { type: "vec3", default: { x: 20, y: 10, z: 20 } },
    speed: { type: "number", default: 1.5 },
    size: { type: "number", default: 0.15 },
    color: { type: "color", default: "#ffffff" },
    opacity: { type: "number", default: 0.8 },
    windStrength: { type: "number", default: 0.4 }, // max wind speed (units/s)
    windVariance: { type: "number", default: 0.15 }, // per-flake sway amplitude
    renderOrder: { type: "int", default: 999 },
  },

  init() {
    const { count, spread, size, color, opacity, renderOrder } = this.data;
    const THREE = AFRAME.THREE;

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread.x;
      positions[i * 3 + 1] = Math.random() * spread.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size,
      transparent: true,
      opacity,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
    this.points.renderOrder = renderOrder;
    this.el.object3D.add(this.points);

    // Per-flake random phase offsets so they don't all sway identically
    this._phaseX = new Float32Array(count);
    this._phaseZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this._phaseX[i] = Math.random() * Math.PI * 2;
      this._phaseZ[i] = Math.random() * Math.PI * 2;
    }

    // Global wind state — direction drifts slowly between random targets
    this._wind = {
      x: 0,
      z: 0,
      targetX: (Math.random() - 0.5) * 2,
      targetZ: (Math.random() - 0.5) * 2,
      timer: 0,
      period: 3 + Math.random() * 4, // seconds between direction shifts
    };

    this._time = 0;
  },

  // Smoothly interpolate global wind direction toward its current target,
  // then pick a new target once the period expires.
  _tickWind(dt) {
    const w = this._wind;
    w.timer += dt;
    const lerpT = Math.min(w.timer / w.period, 1) * 0.02;
    w.x += (w.targetX - w.x) * lerpT;
    w.z += (w.targetZ - w.z) * lerpT;

    if (w.timer >= w.period) {
      w.targetX = (Math.random() - 0.5) * 2;
      w.targetZ = (Math.random() - 0.5) * 2;
      w.timer = 0;
      w.period = 3 + Math.random() * 4;
    }
  },

  tick(_, delta) {
    if (!this.points) return;

    const dt = Math.min(delta, MAX_DELTA_MS) / 1000;
    this._time += dt;
    this._tickWind(dt);

    const pos = this.points.geometry.attributes.position;
    const { speed: fallSpeed, windStrength: ws, windVariance: wv } = this.data;
    const { x: sx, y: sy, z: sz } = this.data.spread;
    const { x: windX, z: windZ } = this._wind;

    for (let i = 0; i < pos.count; i++) {
      // Gentle per-flake sway using sine waves
      const swayX = Math.sin(this._time * 0.8 + this._phaseX[i]) * wv;
      const swayZ = Math.cos(this._time * 0.6 + this._phaseZ[i]) * wv;

      pos.array[i * 3] += (windX * ws + swayX) * dt;
      pos.array[i * 3 + 1] -= fallSpeed * dt;
      pos.array[i * 3 + 2] += (windZ * ws + swayZ) * dt;

      // Wrap X within spread bounds
      if (pos.array[i * 3] > sx * 0.5) pos.array[i * 3] -= sx;
      else if (pos.array[i * 3] < -sx * 0.5) pos.array[i * 3] += sx;

      // Wrap Z within spread bounds
      if (pos.array[i * 3 + 2] > sz * 0.5) pos.array[i * 3 + 2] -= sz;
      else if (pos.array[i * 3 + 2] < -sz * 0.5) pos.array[i * 3 + 2] += sz;

      // Reset to top of volume when flake falls below it
      if (pos.array[i * 3 + 1] < -sy * 0.5) {
        pos.array[i * 3 + 1] = sy * 0.5;
        pos.array[i * 3] = (Math.random() - 0.5) * sx;
        pos.array[i * 3 + 2] = (Math.random() - 0.5) * sz;
      }
    }

    pos.needsUpdate = true;
  },

  remove() {
    if (this.points) {
      this.points.geometry.dispose();
      this.points.material.dispose();
      this.el.object3D.remove(this.points);
    }
  },
});

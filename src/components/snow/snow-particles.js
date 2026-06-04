import AFRAME from "aframe";

AFRAME.registerComponent("snow-particles", {
  schema: {
    count: { type: "int", default: 5000 },
    spread: { type: "vec3", default: { x: 20, y: 10, z: 20 } },
    speed: { type: "number", default: 1.5 },
    size: { type: "number", default: 0.15 },
    color: { type: "color", default: "#ffffff" },
    opacity: { type: "number", default: 0.8 },
    windStrength: { type: "number", default: 0.4 }, // max wind speed units/s
    windVariance: { type: "number", default: 0.15 }, // how fast wind changes
  },

  init() {
    const { count, spread, size, color, opacity } = this.data;
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
    this.el.object3D.add(this.points);

    this._spread = spread;

    // per-flake random phase offsets so they don't all drift identically
    this._phaseX = new Float32Array(count);
    this._phaseZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this._phaseX[i] = Math.random() * Math.PI * 2;
      this._phaseZ[i] = Math.random() * Math.PI * 2;
    }

    // slowly drifting global wind direction (updated via Perlin-like noise)
    this._windX = 0;
    this._windZ = 0;
    this._windTargetX = (Math.random() - 0.5) * 2;
    this._windTargetZ = (Math.random() - 0.5) * 2;
    this._windTimer = 0;
    this._windChangePeriod = 3 + Math.random() * 4; // seconds between wind shifts
    this._time = 0;
  },

  tick(_, delta) {
    if (!this.points) return;
    const dt = Math.min(delta, 50) / 1000;
    const pos = this.points.geometry.attributes.position;
    const fallSpeed = this.data.speed;
    const { x: sx, y: sy, z: sz } = this._spread;
    const ws = this.data.windStrength;
    const wv = this.data.windVariance;

    // smoothly interpolate global wind toward target
    this._windTimer += dt;
    this._time += dt;
    const t = Math.min(this._windTimer / this._windChangePeriod, 1);
    this._windX += (this._windTargetX - this._windX) * t * 0.02;
    this._windZ += (this._windTargetZ - this._windZ) * t * 0.02;
    if (this._windTimer >= this._windChangePeriod) {
      this._windTargetX = (Math.random() - 0.5) * 2;
      this._windTargetZ = (Math.random() - 0.5) * 2;
      this._windTimer = 0;
      this._windChangePeriod = 3 + Math.random() * 4;
    }

    for (let i = 0; i < pos.count; i++) {
      // gentle per-flake sway using sine waves
      const swayX = Math.sin(this._time * 0.8 + this._phaseX[i]) * wv;
      const swayZ = Math.cos(this._time * 0.6 + this._phaseZ[i]) * wv;

      pos.array[i * 3] += (this._windX * ws + swayX) * dt;
      pos.array[i * 3 + 1] -= fallSpeed * dt;
      pos.array[i * 3 + 2] += (this._windZ * ws + swayZ) * dt;

      // wrap X within bounds
      if (pos.array[i * 3] > sx * 0.5) pos.array[i * 3] -= sx;
      else if (pos.array[i * 3] < -sx * 0.5) pos.array[i * 3] += sx;

      // wrap Z within bounds
      if (pos.array[i * 3 + 2] > sz * 0.5) pos.array[i * 3 + 2] -= sz;
      else if (pos.array[i * 3 + 2] < -sz * 0.5) pos.array[i * 3 + 2] += sz;

      // wrap snowflake back to top when it falls below origin
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

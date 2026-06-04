import AFRAME from "aframe";

AFRAME.registerComponent("snow-particles", {
  schema: {
    count: { type: "int", default: 5000 },
    spread: { type: "vec3", default: { x: 20, y: 10, z: 20 } },
    speed: { type: "number", default: 1.5 },
    size: { type: "number", default: 0.15 },
    color: { type: "color", default: "#ffffff" },
    opacity: { type: "number", default: 0.8 },
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

    // store initial Y positions for wraparound
    this._initY = Float32Array.from(positions.filter((_, i) => i % 3 === 1));
    this._spread = spread;
  },

  tick(_, delta) {
    if (!this.points) return;
    const dt = Math.min(delta, 50) / 1000; // cap at 50 ms
    const pos = this.points.geometry.attributes.position;
    const fallSpeed = this.data.speed;
    const { x: sx, y: sy, z: sz } = this._spread;

    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3 + 1] -= fallSpeed * dt;

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

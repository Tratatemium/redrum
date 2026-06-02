import gsap from 'gsap';

function isSolved() {
  const pieces = document.querySelectorAll('.puzzle-piece');
  return [...pieces].every(el => {
    const deg = THREE.MathUtils.radToDeg(el.object3D.rotation.y);
    const normalized = ((deg % 360) + 360) % 360;
    return normalized < 5 || normalized > 355;
  });
}

AFRAME.registerComponent('rotate-on-click', {
  schema: {
    degrees: { default: 22.5 },
    axis:    { default: 'y' } 
  },

  init: function () {
    this.el.addEventListener('click', () => {
      const current = this.el.object3D.rotation[this.data.axis];
      console.log( THREE.MathUtils.radToDeg(current))
      gsap.to(this.el.object3D.rotation, {
        [this.data.axis]: current - THREE.MathUtils.degToRad(this.data.degrees),
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (isSolved()) console.log("solved");
        }
      });
    });
  }
});



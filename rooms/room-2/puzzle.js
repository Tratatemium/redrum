import gsap from 'gsap';

let solved = false;

function isSolved() {
  const pieces = [...document.querySelectorAll('.puzzle-piece')];
  if (pieces.length === 0) return false;

  return pieces.every(piece => {
    const component = piece.components['rotate-on-click'];
    if (!component) return false;
    const currentDegrees = THREE.MathUtils.radToDeg(piece.object3D.rotation[component.data.axis]);
    return Math.abs(currentDegrees - component.data.target) < 1;
  });
}

AFRAME.registerComponent('rotate-on-click', {
  schema: {
    degrees: { default: 22.5 },
    axis:    { default: 'y' },
    target:  { default: 0 }
  },

  init: function () {
    this.el.addEventListener('click', () => {
      if (solved) return;

      const currentRotation = this.el.object3D.rotation[this.data.axis];
      const targetRotation = currentRotation - THREE.MathUtils.degToRad(this.data.degrees);

      gsap.to(this.el.object3D.rotation, {
        [this.data.axis]: targetRotation,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          const rotationRadians = this.el.object3D.rotation[this.data.axis];
          const normalizedRotation = ((rotationRadians % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          this.el.object3D.rotation[this.data.axis] = normalizedRotation;

          if (isSolved()) {
            solved = true;
            console.log("solved");
            document.querySelector('#statue-lamp').setAttribute('lamp', 'variant: normal');
          }
        }
      });
    });
  }
});

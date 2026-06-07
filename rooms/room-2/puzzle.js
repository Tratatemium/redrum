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
    degrees: { default: 45 },
    axis:    { default: 'y' },
    target:  { default: 90 },
    sound:   { default: '' }
  },

  init: function () {
    this.isAnimating = false;

    this.el.addEventListener('click', () => {
      if (solved || this.isAnimating) return;
      this.isAnimating = true;

      if (this.data.sound) {
        document.querySelector(this.data.sound).play();
      }

      const currentRotation = this.el.object3D.rotation[this.data.axis];
      const targetRotation = currentRotation - THREE.MathUtils.degToRad(this.data.degrees);

      gsap.to(this.el.object3D.rotation, {
        [this.data.axis]: targetRotation,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          this.isAnimating = false;
          const rotationRadians = this.el.object3D.rotation[this.data.axis];
          const normalizedRotation = ((rotationRadians % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          this.el.object3D.rotation[this.data.axis] = normalizedRotation;

          const pieces = [...document.querySelectorAll('.puzzle-piece')];
          pieces.forEach((piece, index) => {
            const degrees = THREE.MathUtils.radToDeg(piece.object3D.rotation[this.data.axis]);
            console.log(`piece ${index + 1}: ${degrees.toFixed(1)}°`);
          });

          if (isSolved()) {
            solved = true;
            console.log("solved");
            document.querySelector('#statue-lamp').setAttribute('lamp', 'variant: normal');
            document.querySelector('#statue').components.sound.playSound();
          }
        }
      });
    });
  }
});

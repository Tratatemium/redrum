import gsap from 'gsap';

AFRAME.registerComponent('rotate-on-click', {
  schema: {
    degrees: { default: 22.5 },
    axis:    { default: 'y' } 
  },

  init: function () {
    this.el.addEventListener('click', () => {
      const current = this.el.object3D.rotation[this.data.axis];
      console.log(current)
      gsap.to(this.el.object3D.rotation, {
        [this.data.axis]: current - THREE.MathUtils.degToRad(this.data.degrees),
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }
});



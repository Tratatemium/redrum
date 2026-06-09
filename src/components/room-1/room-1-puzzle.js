AFRAME.registerComponent("room-1-puzzle", {
  init() {
    const tokens = document.querySelectorAll(".token");
    const token1 = document.querySelector(".token-1");
    const token2 = document.querySelector(".token-2");
    const token3 = document.querySelector(".token-3");
    const lights = document.querySelectorAll(".light");
    const animation = document.querySelectorAll(".animated");
    const hide = document.querySelectorAll(".hide");
    let solved = false;

    function almost(a, b) {
      return Math.abs(a - b) < 0.1;
    }

    function onSolved() {
      lights.forEach((light) => {
        light.setAttribute("color", "#FFF");
      });

      let i = 0;
      function stopNext() {
        if (i >= animation.length) return;
        const el = animation[i++];
        el.removeAttribute("animation");
        el.setAttribute("animation-mixer", "timeScale: 0");
        setTimeout(stopNext, 0);
      }
      stopNext();

      hide.forEach((element) => {
        element.setAttribute("visible", false);
      });
    }

    tokens.forEach((token) => {
      token.addEventListener("click", function () {
        if (solved) return;
        const current = this.getAttribute("rotation") || { x: 0, y: 0, z: 0 };
        this.setAttribute("rotation", {
          y: (current.y + 20) % 360,
          x: current.x,
          z: current.z,
        });

        if (
          almost(token1.getAttribute("rotation").y, 100) &&
          almost(token2.getAttribute("rotation").y, 60) &&
          almost(token3.getAttribute("rotation").y, 40)
        ) {
          solved = true;
          setTimeout(onSolved, 0);
        }
      });
    });
  },
});

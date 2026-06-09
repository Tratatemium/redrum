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

    tokens.forEach((token) => {
      token.addEventListener("click", function () {
        const current = this.getAttribute("rotation") || { x: 0, y: 0, z: 0 };
        this.setAttribute("rotation", {
          y: (current.y + 20) % 360,
          x: current.x,
          z: current.z,
        });
        function almost(a, b) {
          return Math.abs(a - b) < 0.1;
        }

        if (
          almost(token1.getAttribute("rotation").y, 100) &&
          almost(token2.getAttribute("rotation").y, 60) &&
          almost(token3.getAttribute("rotation").y, 40)
        ) {
          solved = true;

          lights.forEach((light) => {
            light.setAttribute("color", "#FFF");
          });

          animation.forEach((el) => {
            el.removeAttribute("animation");
            el.setAttribute("animation-mixer", "timeScale: 0");
          });

          hide.forEach((element) => {
            element.setAttribute("visible", false);
          });
        }
      });
    });
  },
});

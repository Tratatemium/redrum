AFRAME.registerComponent("loading", {
  init() {
    const screen = document.querySelector("#player-screen");

    const lamps = document.querySelectorAll("[lamp]");
    const lampsTotal = lamps.length;
    let lampsReady = 0;

    document.querySelector("a-scene").addEventListener("lamp-updated", () => {
      lampsReady++;
      if (lampsReady === lampsTotal) {
        onEverythingReady();
      }
    });

    async function onEverythingReady() {
      console.log("All lamps applied their variant — scene is ready");
      await screen.components["player-screen"].hide(0.6);
      screen.components["player-screen"].clearTexture(0);
    }
  },
});

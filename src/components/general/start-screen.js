const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const sceneReady = new Promise((resolve) => {
  const scene = document.querySelector("a-scene");
  if (scene?.hasLoaded) {
    resolve();
  } else {
    scene?.addEventListener("loaded", resolve, { once: true });
  }
});

startBtn.addEventListener("click", async () => {
  try {
    await document.documentElement.requestFullscreen();
  } catch (_) {}
  await sceneReady;
  document.querySelector("a-scene").emit("game-started");
  startScreen.classList.add("hidden");
});

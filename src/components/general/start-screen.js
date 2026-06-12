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
  startBtn.disabled = true;
  startBtn.classList.add("loading");
  document.documentElement.requestFullscreen().catch(() => {});
  await sceneReady;
  const scene = document.querySelector("a-scene");
  scene.enterVR().catch(() => {});
  scene.emit("game-started");
  startScreen.classList.add("hidden");
});

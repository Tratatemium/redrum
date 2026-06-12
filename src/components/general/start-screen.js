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
  document.documentElement.requestFullscreen().catch(() => {});
  await sceneReady;
  window.SoundManager.playSound("music_normal", { loop: true, volume: 0.7 });
  startScreen.classList.add("hidden");
});

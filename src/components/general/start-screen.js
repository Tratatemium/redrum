const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  document.documentElement.requestFullscreen().catch(() => {});
  SoundManager.playSound("music_normal", { loop: true, volume: 0.7 });
  startScreen.classList.add("hidden");
});

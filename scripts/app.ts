// DOM Element variables
const phoneContainer = document.querySelector(
  ".phone-container"
) as HTMLDivElement;
const topPipe = document.querySelector(
  ".phone-container__top-pipe"
) as HTMLDivElement;
const bottomPipe = document.querySelector(
  ".phone-container__bottom-pipe"
) as HTMLDivElement;
const character = document.querySelector(
  ".phone-container__character"
) as HTMLImageElement;
const scoreElement = document.getElementById(
  "phone-container__score"
) as HTMLParagraphElement;
const restartBtn = document.querySelector(
  "#phone-container__restart-btn"
) as HTMLButtonElement;
const backgroundImg = document.querySelector(
  ".phone-container__background-img"
) as HTMLDivElement;
const gameOverScreen = document.querySelector(
  ".phone-container__game-over-screen"
) as HTMLDivElement;
const startGameScreen = document.querySelector(
  ".phone-container__game-start-screen"
)! as HTMLDivElement;
const startGameBtn = document.querySelector(
  "#phone-container__start-btn"
)! as HTMLDivElement;
const colors = [
  "rgb(134, 69, 69)",
  "#783c3c",
  "brown",
  "green",
  "purple",
  "blue",
  "#611760",
  "#1d6475",
  "#306e3c",
  "blueviolet",
  "cadetblue",
  "#6e5030",
  "darkseagreen",
];
const leftMobileButton = document.querySelector(
  ".left-mobile-button"
) as HTMLDivElement;
const rightMobileButton = document.querySelector(
  ".right-mobile-button"
) as HTMLDivElement;
// Changing variables that interact with game logic and game state
let isArrowKeyDown: boolean = false;
let moveInterval: NodeJS.Timeout | null = null;
let translateY: number = 0;
let isGameOver: boolean = false;
let gameScore: number = 0;
let gameStateInterval: NodeJS.Timeout | null = null;

// Handle audio
const gamePoint = new Audio("/zakky-bird-game/static/point.mp3");
const gameMusic = new Audio(
  "/zakky-bird-game/static/audio_hero_Video-Game-Wizard_SIPML_Q-0245.mp3"
);
const gameOverSoundEffect = new Audio("/zakky-bird-game/static/dieeffect.mp3");

// Pauses keyframe on load
topPipe.style.animationPlayState = "paused";
bottomPipe.style.animationPlayState = "paused";

const startGame = (): void => {
  startGameScreen.style.display = "none";
  topPipe.style.animationPlayState = "running";
  bottomPipe.style.animationPlayState = "running";
  leftMobileButton.style.display = "block";
  rightMobileButton.style.display = "block";
  gameMusic.play();
  gameMusic.loop = true;
  gameMusic.volume = 0.7;
};

startGameBtn.addEventListener("click", startGame);

// After every pipe keyframe iteration, randomly generate a pipe opening position
topPipe.addEventListener("animationiteration", (): void => {
  handleRandomOpening();
  gameScore++;
  const randomNumber = Math.floor(Math.random() * 13);
  topPipe.style.backgroundColor = colors[randomNumber];
  bottomPipe.style.backgroundColor = colors[randomNumber];
  gamePoint.play();
  scoreElement.innerText = gameScore.toString();
});

// Checks every interval if character touches either pipe
const startStateInterval = (): void => {
  gameStateInterval = setInterval((): void => {
    if (
      doesPipeTouchCharacter(topPipe) ||
      doesPipeTouchCharacter(bottomPipe) ||
      character.getBoundingClientRect().top >= phoneContainer.offsetHeight - 40 ||
      character.getBoundingClientRect().top <= 0
    ) {
      isGameOver = true;
      handleGameOver();
    }
  }, 50);
};

startStateInterval();

const stopStateInterval = (): void => {
  if (gameStateInterval !== null) {
    clearInterval(gameStateInterval);
    gameStateInterval = null;
  }
};

// Handles logic for random opening
const handleRandomOpening = (): void => {
  const randomHeight = Math.floor(Math.random() * 84);
  topPipe.style.height = `${randomHeight}%`;
  bottomPipe.style.height = `${100 - randomHeight - 11}%`;
};

// Sets up logic for speed and firing movement on key down
const keyDownEvent = (event: KeyboardEvent): void => {
  if (event.key === "ArrowDown" && !isArrowKeyDown) {
    isArrowKeyDown = true;
    moveInterval = setInterval(() => moveCharacter(27), 22);
  }
  if (event.key === "ArrowUp" && !isArrowKeyDown) {
    isArrowKeyDown = true;
    moveInterval = setInterval(() => moveCharacter(-27), 22);
  }
};

leftMobileButton?.addEventListener("pointerdown", () => {
  if (!isArrowKeyDown) {
    isArrowKeyDown = true;
    moveInterval = setInterval(() => moveCharacter(27), 22);
  }
});

rightMobileButton?.addEventListener("pointerdown", () => {
  if (!isArrowKeyDown) {
    isArrowKeyDown = true;
    moveInterval = setInterval(() => moveCharacter(-27), 22);
  }
});

const releaseEvent = () => {
    isArrowKeyDown = false;
    clearInterval(moveInterval as NodeJS.Timeout);
};

document.addEventListener("pointerup", releaseEvent);
document.addEventListener("pointerleave", releaseEvent);
document.addEventListener("touchend", releaseEvent);

window.addEventListener("keydown", keyDownEvent);

// Clears interval when character is done moving
const keyUpEvent = (event: KeyboardEvent) => {
  if (
    event.key === "ArrowDown" ||
    (event.key === "ArrowUp" && isArrowKeyDown)
  ) {
    isArrowKeyDown = false;
    clearInterval(moveInterval as NodeJS.Timeout);
  }
};

window.addEventListener("keyup", keyUpEvent);

// Checks if pipe touches character
const doesPipeTouchCharacter = (pipe: HTMLDivElement): boolean => {
  const pipeElement = pipe.getBoundingClientRect();
  const characterElement = character.getBoundingClientRect();

  return (
    pipeElement.left < characterElement.right &&
    pipeElement.right > characterElement.left &&
    pipeElement.top < characterElement.bottom &&
    pipeElement.bottom > characterElement.top
  );
};

// Logic for how many pixels moved when down key is pressed
const moveCharacter = (num: number): void => {
  console.log("hi");
  translateY += num;
  character.style.transform = `translateY(${translateY}%) scaleX(-1)`;
};

// Handles logic for restarting game for restart button click
const handleGameRestart = (): void => {
  isGameOver = false;
  translateY = 50;
  leftMobileButton.style.display = "block";
  rightMobileButton.style.display = "block";
  gameMusic.play();
  character.style.transform = `translateY(${translateY}%) scaleX(-1)`;
  window.addEventListener("keydown", keyDownEvent);
  window.addEventListener("keyup", keyUpEvent);
  backgroundImg.style.backgroundImage = "url('/zakky-bird-game/static/bggif.gif')";
  gameOverScreen.style.display = "none";
  gameScore = 0;
  scoreElement.innerText = gameScore.toString();
  topPipe.style.animation = "none";
  bottomPipe.style.animation = "none";
  void topPipe.offsetWidth;
  void bottomPipe.offsetWidth;
  topPipe.style.animation = "move-top-pipe 2s linear infinite";
  bottomPipe.style.animation = "move-bottom-pipe 2s linear infinite";
  startStateInterval();
  document.removeEventListener("pointerdown", releaseEvent);
  document.removeEventListener("pointerup", releaseEvent)
  document.removeEventListener("touchend", releaseEvent);

  // Reset the state of arrow key
  isArrowKeyDown = false;

  // Clear the moveInterval if it is set and arrow key is not down
  if (moveInterval !== null && !isArrowKeyDown) {
    clearInterval(moveInterval);
    moveInterval = null;
  }
};



restartBtn.addEventListener("click", handleGameRestart);

// Handles logic that happens when player reaches game over state
const handleGameOver = (): void => {
  const gameEndScore = document.querySelector(
    "#game-over-score"
  ) as HTMLSpanElement;
  if (isGameOver) {
    leftMobileButton.style.display = "none";
    rightMobileButton.style.display = "none";
    gameEndScore.innerText = gameScore.toString();
    gameOverSoundEffect.volume = 0.7;
    gameOverSoundEffect.play();
    gameMusic.pause();
    window.removeEventListener("keydown", keyDownEvent);
    window.removeEventListener("keyup", keyUpEvent);
    stopStateInterval();
    gameOverScreen.style.display = "flex";
    topPipe.style.animationPlayState = "paused";
    bottomPipe.style.animationPlayState = "paused";
    backgroundImg.style.backgroundImage = "url('/zakky-bird-game/static/void-img.png')";
  }
};

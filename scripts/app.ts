// DOM Element variables
const topPipe = document.querySelector(
  ".phone-container__top-pipe"
) as HTMLDivElement;
const bottomPipe = document.querySelector(
  ".phone-container__bottom-pipe"
) as HTMLDivElement;
const character = document.querySelector(
  ".phone-container__character"
) as HTMLDivElement;
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
// Changing variables that interact with game logic and game state
let isArrowKeyDown: boolean = false;
let moveInterval: NodeJS.Timeout | null = null;
let translateY: number = 0;
let isGameOver: boolean = false;
let gameScore: number = 0;
let gameStateInterval: NodeJS.Timeout | null = null;

// After every pipe keyframe iteration, randomly generate a pipe opening position
topPipe.addEventListener("animationiteration", (): void => {
  handleRandomOpening();
  gameScore++;
  scoreElement.innerText = gameScore.toString();
});

// Checks every interval if character touches either pipe
const startStateInterval = (): void => {
  gameStateInterval = setInterval((): void => {
    if (doesPipeTouchCharacter(topPipe) || doesPipeTouchCharacter(bottomPipe)) {
      isGameOver = true;
      handleGameOver();
    }
  }, 100);
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
    moveInterval = setInterval(() => moveCharacter(10), 22);
  }
  if (event.key === "ArrowUp" && !isArrowKeyDown) {
    isArrowKeyDown = true;
    moveInterval = setInterval(() => moveCharacter(-10), 22);
  }
};

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
  translateY += num;
  character.style.transform = `translateY(${translateY}px)`;
};

// Handles logic for restarting game for restart button click
const handleGameRestart = (): void => {
    isGameOver = false;
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("keyup", keyUpEvent);
    backgroundImg.style.backgroundImage = "url('../static/bggif.gif')";
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
};

restartBtn.addEventListener("click", handleGameRestart);

// Handles logic that happens when player reaches game over state
const handleGameOver = (): void => {
  if (isGameOver) {
    stopStateInterval();
    gameOverScreen.style.display = "flex";
    topPipe.style.animationPlayState = "paused";
    bottomPipe.style.animationPlayState = "paused";
    backgroundImg.style.backgroundImage = "url('../static/void-img.png')";
    window.removeEventListener("keydown", keyDownEvent);
    window.removeEventListener("keyup", keyUpEvent);
  }
};

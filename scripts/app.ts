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
let isArrowKeyDown: boolean = false;
let moveInterval: NodeJS.Timeout | null = null;
let translateY: number = 0;
let isGameOver: boolean = false;
let gameScore: number = 0;

// After every pipe keyframe iteration, randomly generate a pipe opening position
topPipe.addEventListener("animationiteration", (): void => {
  handleRandomOpening();
  gameScore++;
  scoreElement.innerText = gameScore.toString();
});

// Checks every interval if character touches either pipe
const checkStateInterval = setInterval(() => {
  if (doesPipeTouchCharacter(topPipe) || doesPipeTouchCharacter(bottomPipe)) {
    isGameOver = true;
    handleGameOver();
  }
}, 100);

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
  const pipeEl = pipe.getBoundingClientRect();
  const characterEl = character.getBoundingClientRect();

  return (
    pipeEl.left < characterEl.right &&
    pipeEl.right > characterEl.left &&
    pipeEl.top < characterEl.bottom &&
    pipeEl.bottom > characterEl.top
  );
};

// Logic for how many pixels moved when down key is pressed
const moveCharacter = (num: number): void => {
  translateY += num;
  character.style.transform = `translateY(${translateY}px)`;
};

const handleGameOver = (): void => {
  if (isGameOver) {
    const backgroundImg = document.querySelector(
      ".phone-container__background-img"
    ) as HTMLDivElement;
    const gameOverScreen = document.querySelector('.phone-container__game-over-screen') as HTMLDivElement;

    clearInterval(checkStateInterval);
    gameOverScreen.style.display = 'flex';
    console.log(isGameOver);
    topPipe.style.animationPlayState = "paused";
    bottomPipe.style.animationPlayState = "paused";
    backgroundImg.style.backgroundImage = "url('../static/void-img.png')";
    window.removeEventListener("keydown", keyDownEvent);
    window.removeEventListener("keyup", keyUpEvent);
  }
};

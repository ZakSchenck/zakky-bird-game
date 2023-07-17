// DOM Element variables
var phoneContainer = document.querySelector(".phone-container");
var topPipe = document.querySelector(".phone-container__top-pipe");
var bottomPipe = document.querySelector(".phone-container__bottom-pipe");
var character = document.querySelector(".phone-container__character");
var scoreElement = document.getElementById("phone-container__score");
var restartBtn = document.querySelector("#phone-container__restart-btn");
var backgroundImg = document.querySelector(".phone-container__background-img");
var gameOverScreen = document.querySelector(".phone-container__game-over-screen");
var startGameScreen = document.querySelector(".phone-container__game-start-screen");
var startGameBtn = document.querySelector("#phone-container__start-btn");
var colors = [
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
var leftMobileButton = document.querySelector(".left-mobile-button");
var rightMobileButton = document.querySelector(".right-mobile-button");
// Changing variables that interact with game logic and game state
var isArrowKeyDown = false;
var moveInterval = null;
var translateY = 0;
var isGameOver = false;
var gameScore = 0;
var gameStateInterval = null;
// Handle audio
var gamePoint = new Audio("/zakky-bird-game/point.mp3");
var gameMusic = new Audio("/zakky-bird-game/audio_hero_Video-Game-Wizard_SIPML_Q-0245.mp3");
var gameOverSoundEffect = new Audio("/zakky-bird-game/dieeffect.mp3");
// Pauses keyframe on load
topPipe.style.animationPlayState = "paused";
bottomPipe.style.animationPlayState = "paused";
var startGame = function () {
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
topPipe.addEventListener("animationiteration", function () {
    handleRandomOpening();
    gameScore++;
    var randomNumber = Math.floor(Math.random() * 13);
    topPipe.style.backgroundColor = colors[randomNumber];
    bottomPipe.style.backgroundColor = colors[randomNumber];
    gamePoint.play();
    scoreElement.innerText = gameScore.toString();
});
// Checks every interval if character touches either pipe
var startStateInterval = function () {
    gameStateInterval = setInterval(function () {
        if (doesPipeTouchCharacter(topPipe) ||
            doesPipeTouchCharacter(bottomPipe) ||
            character.getBoundingClientRect().top >= phoneContainer.offsetHeight - 40 ||
            character.getBoundingClientRect().top <= 0) {
            isGameOver = true;
            handleGameOver();
        }
    }, 50);
};
startStateInterval();
var stopStateInterval = function () {
    if (gameStateInterval !== null) {
        clearInterval(gameStateInterval);
        gameStateInterval = null;
    }
};
// Handles logic for random opening
var handleRandomOpening = function () {
    var randomHeight = Math.floor(Math.random() * 84);
    topPipe.style.height = "".concat(randomHeight, "%");
    bottomPipe.style.height = "".concat(100 - randomHeight - 11, "%");
};
// Sets up logic for speed and firing movement on key down
var keyDownEvent = function (event) {
    if (event.key === "ArrowDown" && !isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(27); }, 22);
    }
    if (event.key === "ArrowUp" && !isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(-27); }, 22);
    }
};
leftMobileButton === null || leftMobileButton === void 0 ? void 0 : leftMobileButton.addEventListener("pointerdown", function () {
    if (!isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(27); }, 22);
    }
});
rightMobileButton === null || rightMobileButton === void 0 ? void 0 : rightMobileButton.addEventListener("pointerdown", function () {
    if (!isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(-27); }, 22);
    }
});
var releaseEvent = function () {
    isArrowKeyDown = false;
    clearInterval(moveInterval);
};
document.addEventListener("pointerup", releaseEvent);
document.addEventListener("pointerleave", releaseEvent);
document.addEventListener("touchend", releaseEvent);
window.addEventListener("keydown", keyDownEvent);
// Clears interval when character is done moving
var keyUpEvent = function (event) {
    if (event.key === "ArrowDown" ||
        (event.key === "ArrowUp" && isArrowKeyDown)) {
        isArrowKeyDown = false;
        clearInterval(moveInterval);
    }
};
window.addEventListener("keyup", keyUpEvent);
// Checks if pipe touches character
var doesPipeTouchCharacter = function (pipe) {
    var pipeElement = pipe.getBoundingClientRect();
    var characterElement = character.getBoundingClientRect();
    return (pipeElement.left < characterElement.right &&
        pipeElement.right > characterElement.left &&
        pipeElement.top < characterElement.bottom &&
        pipeElement.bottom > characterElement.top);
};
// Logic for how many pixels moved when down key is pressed
var moveCharacter = function (num) {
    console.log("hi");
    translateY += num;
    character.style.transform = "translateY(".concat(translateY, "%) scaleX(-1)");
};
// Handles logic for restarting game for restart button click
var handleGameRestart = function () {
    isGameOver = false;
    translateY = 50;
    leftMobileButton.style.display = "block";
    rightMobileButton.style.display = "block";
    gameMusic.play();
    character.style.transform = "translateY(".concat(translateY, "%) scaleX(-1)");
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("keyup", keyUpEvent);
    backgroundImg.style.backgroundImage = "url('/zakky-bird-game/bggif.gif')";
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
    document.removeEventListener("pointerup", releaseEvent);
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
var handleGameOver = function () {
    var gameEndScore = document.querySelector("#game-over-score");
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
        backgroundImg.style.backgroundImage = "url('/zakky-bird-game/void-img.png')";
    }
};

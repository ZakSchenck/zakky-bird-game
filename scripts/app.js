// DOM Element variables
var topPipe = document.querySelector(".phone-container__top-pipe");
var bottomPipe = document.querySelector(".phone-container__bottom-pipe");
var character = document.querySelector(".phone-container__character");
var scoreElement = document.getElementById("phone-container__score");
var restartBtn = document.querySelector("#phone-container__restart-btn");
var backgroundImg = document.querySelector(".phone-container__background-img");
var gameOverScreen = document.querySelector(".phone-container__game-over-screen");
// Changing variables that interact with game logic and game state
var isArrowKeyDown = false;
var moveInterval = null;
var translateY = 0;
var isGameOver = false;
var gameScore = 0;
var gameStateInterval = null;
// After every pipe keyframe iteration, randomly generate a pipe opening position
topPipe.addEventListener("animationiteration", function () {
    handleRandomOpening();
    gameScore++;
    scoreElement.innerText = gameScore.toString();
});
// Checks every interval if character touches either pipe
var startStateInterval = function () {
    gameStateInterval = setInterval(function () {
        if (doesPipeTouchCharacter(topPipe) || doesPipeTouchCharacter(bottomPipe)) {
            isGameOver = true;
            handleGameOver();
        }
    }, 100);
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
        moveInterval = setInterval(function () { return moveCharacter(10); }, 22);
    }
    if (event.key === "ArrowUp" && !isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(-10); }, 22);
    }
};
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
    translateY += num;
    character.style.transform = "translateY(".concat(translateY, "px)");
};
// Handles logic for restarting game for restart button click
var handleGameRestart = function () {
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
var handleGameOver = function () {
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

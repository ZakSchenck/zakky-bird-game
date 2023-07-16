// DOM Element variables
var topPipe = document.querySelector(".phone-container__top-pipe");
var bottomPipe = document.querySelector(".phone-container__bottom-pipe");
var character = document.querySelector(".phone-container__character");
var scoreElement = document.getElementById("phone-container__score");
var restartBtn = document.querySelector("#phone-container__restart-btn");
var backgroundImg = document.querySelector(".phone-container__background-img");
var gameOverScreen = document.querySelector(".phone-container__game-over-screen");
var startGameScreen = document.querySelector(".phone-container__game-start-screen");
var startGameBtn = document.querySelector("#phone-container__start-btn");
// Changing variables that interact with game logic and game state
var isArrowKeyDown = false;
var moveInterval = null;
var translateY = 0;
var isGameOver = false;
var gameScore = 0;
var gameStateInterval = null;
// Handle audio
var gamePoint = new Audio("../static/point.mp3");
var gameMusic = new Audio("../static/audio_hero_Video-Game-Wizard_SIPML_Q-0245.mp3");
var gameOverSoundEffect = new Audio("../static/dieeffect.mp3");
// Pauses keyframe on load
topPipe.style.animationPlayState = "paused";
bottomPipe.style.animationPlayState = "paused";
var startGame = function () {
    startGameScreen.style.display = "none";
    topPipe.style.animationPlayState = "running";
    bottomPipe.style.animationPlayState = "running";
    gameMusic.play();
    gameMusic.loop = true;
    gameMusic.volume = 0.7;
};
startGameBtn.addEventListener("click", startGame);
// After every pipe keyframe iteration, randomly generate a pipe opening position
topPipe.addEventListener("animationiteration", function () {
    handleRandomOpening();
    gameScore++;
    gamePoint.play();
    scoreElement.innerText = gameScore.toString();
});
// Checks every interval if character touches either pipe
var startStateInterval = function () {
    gameStateInterval = setInterval(function () {
        console.log(character.getBoundingClientRect());
        if (doesPipeTouchCharacter(topPipe) ||
            doesPipeTouchCharacter(bottomPipe) ||
            character.getBoundingClientRect().top >= 627 ||
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
    character.style.transform = "translateY(".concat(translateY, "px) scaleX(-1)");
};
// Handles logic for restarting game for restart button click
var handleGameRestart = function () {
    isGameOver = false;
    translateY = 50;
    gameMusic.play();
    character.style.transform = "translateY(".concat(translateY, "%) scaleX(-1)");
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
    // Reset the state of arrow key
    isArrowKeyDown = false;
    // Clear the moveInterval if it is set
    if (moveInterval !== null) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
};
restartBtn.addEventListener("click", handleGameRestart);
// Handles logic that happens when player reaches game over state
var handleGameOver = function () {
    var gameEndScore = document.querySelector('#game-over-score');
    if (isGameOver) {
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
        backgroundImg.style.backgroundImage = "url('../static/void-img.png')";
    }
};

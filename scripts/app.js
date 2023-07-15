var topPipe = document.querySelector(".phone-container__top-pipe");
var bottomPipe = document.querySelector(".phone-container__bottom-pipe");
var character = document.querySelector(".phone-container__character");
var scoreElement = document.getElementById("phone-container__score");
var isArrowKeyDown = false;
var moveInterval = null;
var translateY = 0;
var isGameOver = false;
var gameScore = 0;
// After every pipe keyframe iteration, randomly generate a pipe opening position
topPipe.addEventListener("animationiteration", function () {
    handleRandomOpening();
    gameScore++;
    scoreElement.innerText = gameScore.toString();
});
// Checks every interval if character touches either pipe
var checkStateInterval = setInterval(function () {
    if (doesPipeTouchCharacter(topPipe) || doesPipeTouchCharacter(bottomPipe)) {
        isGameOver = true;
        handleGameOver();
    }
}, 100);
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
    var pipeEl = pipe.getBoundingClientRect();
    var characterEl = character.getBoundingClientRect();
    return (pipeEl.left < characterEl.right &&
        pipeEl.right > characterEl.left &&
        pipeEl.top < characterEl.bottom &&
        pipeEl.bottom > characterEl.top);
};
// Logic for how many pixels moved when down key is pressed
var moveCharacter = function (num) {
    translateY += num;
    character.style.transform = "translateY(".concat(translateY, "px)");
};
var handleGameOver = function () {
    if (isGameOver) {
        var backgroundImg = document.querySelector(".phone-container__background-img");
        var gameOverScreen = document.querySelector('.phone-container__game-over-screen');
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

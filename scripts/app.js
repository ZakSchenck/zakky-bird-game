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
setInterval(function () {
    if (doesPipeTouchCharacter(topPipe) || doesPipeTouchCharacter(bottomPipe)) {
        isGameOver = true;
    }
}, 100);
// Handles logic for random opening
var handleRandomOpening = function () {
    var randomHeight = Math.floor(Math.random() * 84);
    topPipe.style.height = "".concat(randomHeight, "%");
    bottomPipe.style.height = "".concat(100 - randomHeight - 11, "%");
};
// Sets up logic for speed and firing movement on key down
window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown" && !isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(10); }, 22);
    }
    if (event.key === "ArrowUp" && !isArrowKeyDown) {
        isArrowKeyDown = true;
        moveInterval = setInterval(function () { return moveCharacter(-10); }, 22);
    }
});
// Clears interval when character is done moving
window.addEventListener("keyup", function (event) {
    if (event.key === "ArrowDown" ||
        (event.key === "ArrowUp" && isArrowKeyDown)) {
        isArrowKeyDown = false;
        clearInterval(moveInterval);
    }
});
// Checks if pipe touches character
var doesPipeTouchCharacter = function (pipe) {
    var rect1 = pipe.getBoundingClientRect();
    var rect2 = character.getBoundingClientRect();
    return (rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top);
};
// Logic for how many pixels moved when down key is pressed
var moveCharacter = function (num) {
    translateY += num;
    character.style.transform = "translateY(".concat(translateY, "px)");
};

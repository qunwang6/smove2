// timer

let globalTimer;
let buttonTimer;

// window resize event

window.onresize = adjust;

// key press event on PC

document.onkeydown = function(event) {
    let key = event.keyCode;
    if (key >= 37 && key <= 40) {
        if (!logic.canWhiteBallMove()) {
            return;
        }
        if (key === 37) logic.shift(-1, 0);
        if (key === 38) logic.shift(0, -1);
        if (key === 39) logic.shift(1, 0);
        if (key === 40) logic.shift(0, 1);
        adjustWhiteBall();
        if (logic.eat()) {
            logic.generateItem();
            adjustItem();
            document.getElementById("score").innerHTML = String(logic.score);
            document.getElementById("best").innerHTML = "BEST: " + String(logic.best);
            if (logic.score % 10 === 0) {
                ++logic.level;
                displayLevelLabel();
                bgAlter();
            }
        }
    }
};

// finger slide event on Mobile

function getAngle(dX, dY) {
    let ang = Math.atan2(dY, dX) / Math.PI * 180.0;
    if (ang < 0) ang += 360.0;
    return ang;
}

function Touch() {
    this.canMove = false;
    this.posX = 0.0;
    this.posY = 0.0;

    this.recordFingerPosition = function(event) {
        let rec = event.targetTouches[0];
        this.posX = rec.pageX;
        this.posY = rec.pageY;
        this.canMove = true;
    };

    this.slide = function(event) {
        event.preventDefault();
        if (this.canMove && logic.canWhiteBallMove() && event.targetTouches.length === 1) {
            let rec = event.targetTouches[0];
            let dX = rec.pageX - this.posX;
            let dY = rec.pageY - this.posY;
            let ang = getAngle(dX, dY);
            if (45.0 < ang && ang <= 135.0) {
                logic.shift(0, 1);
            }
            else if (135.0 < ang && ang <= 225.0) {
                logic.shift(-1, 0);
            }
            else if (225.0 < ang && ang <= 315.0) {
                logic.shift(0, -1);
            }
            else {
                logic.shift(1, 0);
            }
            adjustWhiteBall();
            if (logic.eat()) {
                logic.generateItem();
                adjustItem();
                document.getElementById("score").innerHTML = String(logic.score);
                document.getElementById("best").innerHTML = "BEST: " + String(logic.best);
                if (logic.score % 10 === 0) {
                    ++logic.level;
                    displayLevelLabel();
                    bgAlter();
                }
            }
            this.canMove = false;
        }
    };
}

let touch = new Touch();
document.addEventListener("touchstart", touch.recordFingerPosition, false);
document.addEventListener("touchmove", touch.slide, false);

// game status

function modifyStart() {
    let smoveStart = document.getElementById("smove_start");
    let op = smoveStart.style.opacity;
    smoveStart.style.opacity = 1 - op;
}

function gamePause() {
    if (logic.alive) {
        if (logic.paused) {
            globalTimer = window.setInterval(updateAnimation, 20);
            logic.paused = false;
        }
        else {
            window.clearInterval(globalTimer);
            logic.paused = true;
        }
    }
}

function gameFinished() {
    window.clearInterval(globalTimer);
    logic.paused = true;
    logic.alive = false;
    let whiteball = document.getElementById("whiteball");
    let restart = document.getElementById("restart");
    window.setTimeout(()=>{whiteball.style.opacity = 0.0}, 1000);
    window.setTimeout(()=>{restart.style.visibility = "visible"; restart.style.opacity = 1.0}, 3000);
    window.setTimeout(()=>{whiteball.style.visibility = "hidden"; whiteball.style.opacity = 1.0}, 3000);
}

function gameRestart() {
    let restart = document.getElementById("restart");
    restart.style.visibility = "hidden";
    restart.style.opacity = 0.0;
    let whiteball = document.getElementById("whiteball");
    whiteball.style.visibility = "visible";
    let score = document.getElementById("score");
    score.innerHTML = String("0");
    main();
}

function gamePreparation() {
    adjust();
    logic.paused = true;
    logic.birthplace = getBirthplace();
    logic.verticalRatio = getVerticalRatio();
    logic.bounceRatioX = getBounceRatioX();
    logic.bounceRatioY = getBounceRatioY();
    document.getElementById("maincanvas").style.visibility = "hidden";
    document.getElementById("whiteball").style.visibility = "hidden";
    document.getElementById("item").style.visibility = "hidden";
    document.getElementById("best").style.visibility = "hidden";
    document.getElementById("score").style.visibility = "hidden";
    document.getElementById("pause").style.visibility = "hidden";
    buttonTimer = window.setInterval(modifyStart, 1000);
}

// main

function main() {
    logic.clear();
    document.getElementById("maincanvas").style.visibility = "visible";
    document.getElementById("whiteball").style.visibility = "visible";
    document.getElementById("item").style.visibility = "visible";
    document.getElementById("best").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";
    document.getElementById("pause").style.visibility = "visible";
    document.getElementById("smove").style.visibility = "hidden";
    document.getElementById("smove_start").style.visibility = "hidden";
    adjust();
    bgRestore();
    displayLevelLabel();
    if (buttonTimer !== null) {
        window.clearInterval(buttonTimer);
        buttonTimer = null;
    }
    globalTimer = window.setInterval(updateAnimation, 20);
}
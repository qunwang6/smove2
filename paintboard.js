/*
deal with the canvas besides background
and some data-parsing functions
 */

let ratioWidth = 10;
let ratioHeight = 16;

let logic = new Logic();

function clientFit(w, h) {
    let dt = 16;
    if (w * ratioHeight <= h * ratioWidth) {
        return [w - dt, (w - dt) / ratioWidth * ratioHeight];
    }
    else {
        return [(h - dt) / ratioHeight * ratioWidth, h - dt];
    }
}

function getBoardEdgeLength() {
    return parseFloat(document.getElementsByClassName("paintboard")[0].style.width) / 10 * 4;
}

function getGridEdgeLength() {
    return getBoardEdgeLength() / 3;
}

function getBoardLeft() {
    return parseFloat(document.getElementsByClassName("paintboard")[0].style.width) * 0.3;
}

function getBoardTop() {
    return parseFloat(document.getElementsByClassName("paintboard")[0].style.height) * 0.388889;
}

function getVerticalRatio() {
    let paintboard = document.getElementsByClassName("paintboard")[0];
    let ballDiameter = getGridEdgeLength() * logic.blackballRatio;
    return (parseFloat(paintboard.style.width) + ballDiameter) / (parseFloat(paintboard.style.height) + ballDiameter);
}

function getBounceRatioX() {
    let paintboard = document.getElementsByClassName("paintboard")[0];
    let ballDiameter = getGridEdgeLength() * logic.blackballRatio;
    return ballDiameter / (parseFloat(paintboard.style.width) + ballDiameter);
}

function getBounceRatioY() {
    let paintboard = document.getElementsByClassName("paintboard")[0];
    let ballDiameter = getGridEdgeLength() * logic.blackballRatio;
    return ballDiameter / (parseFloat(paintboard.style.height) + ballDiameter);
}

function getCollisionParameter() {
    let paintboard = document.getElementsByClassName("paintboard")[0];
    let para1 = parseFloat(paintboard.style.width);
    let para2 = parseFloat(paintboard.style.height);
    let para3 = getBoardLeft();
    let para4 = getBoardTop();
    let para5 = getGridEdgeLength();
    return [para1, para2, para3, para4, para5];
}

function getBirthplace() {
    let paintBoard = document.getElementById("blackball");
    let defaultPaintBoard = window.getComputedStyle(paintBoard, null); // ok
    let gridLength = getGridEdgeLength();
    let ballRadius = gridLength * logic.blackballRatio / 2;
    let startX = -ballRadius;
    let startY = -ballRadius;
    let dX = parseFloat(defaultPaintBoard.width) + ballRadius * 2;
    let dY = parseFloat(defaultPaintBoard.height) + ballRadius * 2;
    let pX = getBoardLeft() - startX;
    let pY = getBoardTop() - startY;
    let result = [];
    for (let i = 0; i < 3; ++i) {
        result.push([(pX + gridLength * i + gridLength / 2) / dX, 0., -150., -30.]);
    }
    for (let i = 0; i < 3; ++i) {
        result.push([1., (pY + gridLength * i + gridLength / 2) / dY, 120., 240.]);
    }
    for (let i = 0; i < 3; ++i) {
        result.push([(pX + gridLength * (2 - i) + gridLength / 2) / dX, 1., 30., 150.]);
    }
    for (let i = 0; i < 3; ++i) {
        result.push([0., (pY + gridLength * (2 - i) + gridLength / 2) / dY, -60., 60.]);
    }
    return result;
}

function adjustPaintBoard() {
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    let paintBoard = document.getElementsByClassName("paintboard")[0];
    let tup = clientFit(clientWidth, clientHeight);
    let boardWidth = tup[0];
    let boardHeight = tup[1];
    paintBoard.style.left = String((clientWidth - boardWidth) / 2) + "px";
    paintBoard.style.top = String((clientHeight - boardHeight) / 2) + "px";
    paintBoard.style.width = String(boardWidth) + "px";
    paintBoard.style.height = String(boardHeight) + "px";
}

function adjustCanvas() {
    let canvasEdgeLength = getBoardEdgeLength();
    let mainCanvas = document.getElementById("maincanvas");
    mainCanvas.width = canvasEdgeLength;
    mainCanvas.height = canvasEdgeLength;
    mainCanvas.style.borderRadius = String(canvasEdgeLength / 4) + "px";

    let cel = canvasEdgeLength / 3;
    let cel3 = canvasEdgeLength;
    let ctx = mainCanvas.getContext("2d");
    let dx = cel / 10;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(dx, cel);
    ctx.lineTo(cel3 - dx, cel);
    ctx.stroke();

    ctx.moveTo(dx, cel * 2);
    ctx.lineTo(cel3 - dx, cel * 2);
    ctx.stroke();

    ctx.moveTo(cel, dx);
    ctx.lineTo(cel, cel3 - dx);
    ctx.stroke();

    ctx.moveTo(cel * 2, dx);
    ctx.lineTo(cel * 2, cel3 - dx);
    ctx.stroke();
}

function adjustPauseLabel() {
    let pause = document.getElementById("pause");
    pause.style.fontSize = String(getGridEdgeLength() / 2) + "px";
}

function adjustBestLabel() {
    let best = document.getElementById("best");
    best.style.fontSize = String(getGridEdgeLength() / 2) + "px";
}

function adjustScoreLabel() {
    let score = document.getElementById("score");
    score.style.fontSize = String(getGridEdgeLength()) + "px";
}

function displayLevelLabel() {
    adjustLevelLabel();
    let level = document.getElementById("level");
    level.style.opacity = 1.0;
    window.setTimeout(()=>{level.style.opacity = 0.0;}, 1000);
}

function adjustLevelLabel() {
    let level = document.getElementById("level");
    level.innerHTML = "LEVEL " + (Math.floor((logic.level - 1) / 5) + 1) + "-" + ((logic.level - 1) % 5 + 1);
    level.style.fontSize = String(getBoardEdgeLength() / 6) + "px";
    let paintBoard = document.getElementsByClassName("paintboard")[0];
    let boardWidth = paintBoard.style.width;
    let dum1 = (parseFloat(boardWidth) - parseFloat(document.defaultView.getComputedStyle(level, null).width)) / 2; // ok
    level.style.left = String(dum1) + "px";
    let dum2 = getBoardTop() - getGridEdgeLength() * 1.2;
    level.style.top = String(dum2) + "px";
}

function adjustRestartLabel() {
    let restart = document.getElementById("restart");
    restart.style.fontSize = String(getBoardEdgeLength() / 5) + "px";
    let paintBoard = document.getElementsByClassName("paintboard")[0];
    let boardWidth = paintBoard.style.width;
    let dum1 = (parseFloat(boardWidth) - parseFloat(document.defaultView.getComputedStyle(restart, null).width)) / 2; // ok
    restart.style.left = String(dum1) + "px";
    let mainCanvas = document.getElementById("maincanvas");
    let mCbottom = getBoardTop() + getBoardEdgeLength() + getGridEdgeLength() * 0.5;
    restart.style.top = String(mCbottom) + "px";
}

function adjustWhiteBall() {
    let canvasEdgeLength = getBoardEdgeLength();
    let mainCanvas = document.getElementById("whiteball");
    mainCanvas.width = canvasEdgeLength;
    mainCanvas.height = canvasEdgeLength;
    mainCanvas.style.borderRadius = String(canvasEdgeLength / 4) + "px";

    let cel = canvasEdgeLength / 3;
    let celhalf = cel / 2;
    let ctx = mainCanvas.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    let arcx = (logic.whiteball.gridX - logic.whiteball.spdX * logic.whiteball.rest) * cel + celhalf;
    let arcy = (logic.whiteball.gridY - logic.whiteball.spdY * logic.whiteball.rest) * cel + celhalf;
    ctx.arc(arcx, arcy, celhalf * logic.whiteballRatio, 0, 2 * Math.PI);
    ctx.fill();
}

function adjustBlackBall() {
    let paintBoard = document.getElementsByClassName("paintboard")[0];
    let blackball = document.getElementById("blackball");
    blackball.width = parseFloat(paintBoard.style.width);
    blackball.height = parseFloat(paintBoard.style.height);

    let defaultPaintBoard = document.defaultView.getComputedStyle(paintBoard, null); // ok
    let ballRadius = getGridEdgeLength() * logic.blackballRatio / 2;
    let startX = -ballRadius;
    let startY = -ballRadius;
    let dX = parseFloat(defaultPaintBoard.width) + ballRadius * 2;
    let dY = parseFloat(defaultPaintBoard.height) + ballRadius * 2;

    let ctx = blackball.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    for (let i in logic.blackballs) {
        let blackball = logic.blackballs[i];
        let posX = startX + blackball.posX * dX;
        let posY = startY + blackball.posY * dY;
        ctx.beginPath();
        ctx.arc(posX, posY, ballRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function pointRotate(pt, ang) {
    let x = pt[0];
    let y = pt[1];
    let cost = Math.cos(ang / 180 * Math.PI);
    let sint = Math.sin(ang / 180 * Math.PI);
    return [x * cost - y * sint, x * sint + y * cost];
}

function adjustItem() {
    let canvasEdgeLength = getBoardEdgeLength();
    let mainCanvas = document.getElementById("item");
    mainCanvas.width = canvasEdgeLength;
    mainCanvas.height = canvasEdgeLength;
    mainCanvas.style.borderRadius = String(canvasEdgeLength / 4) + "px";

    let cel = canvasEdgeLength / 3;
    let celhalf = cel / 2;
    let veclen = celhalf * logic.itemRatio;
    let r = veclen / 3;

    let ctx = mainCanvas.getContext("2d");
    if (logic.score % 10 === 9) {
        ctx.strokeStyle = "#FFFF00";
        ctx.fillStyle = "#FFFF00";
    }
    else {
        ctx.strokeStyle = "#0055FF";
        ctx.fillStyle = "#0055FF";
    }
    ctx.save();
    ctx.translate(logic.item.gridX * cel + celhalf, logic.item.gridY * cel + celhalf);
    let vecedge = pointRotate([veclen, veclen - r], logic.item.ang);
    let dum1 = Math.sqrt(2) * veclen;
    let vecpoint = pointRotate([dum1, 0], logic.item.ang + 45);

    ctx.beginPath();
    ctx.moveTo(vecedge[0], -vecedge[1]);
    for (let i = 0; i < 4; ++i) {
        vecedge = pointRotate(vecedge, 90);
        ctx.arcTo(vecpoint[0], -vecpoint[1], vecedge[0], -vecedge[1], r);
        vecpoint = pointRotate(vecpoint, 90);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function adjustSmove() {
    let smove = document.getElementById("smove");
    let paintBoard = document.getElementsByClassName("paintboard")[0];
    smove.style.fontSize = parseFloat(paintBoard.style.width) / 5 + "px";

    let smoveStart = document.getElementById("smove_start");
    smoveStart.style.fontSize = parseFloat(paintBoard.style.width) / 20 + "px";
}

function adjust() {
    adjustPaintBoard();
    adjustCanvas();
    adjustPauseLabel();
    adjustBestLabel();
    adjustScoreLabel();
    adjustLevelLabel();
    adjustRestartLabel();
    adjustWhiteBall();
    adjustBlackBall();
    adjustItem();
    adjustSmove();
}

function updateAnimation() {
    logic.rotateItem();
    adjustItem();
    if (!logic.canWhiteBallMove()) {
        --logic.whiteball.rest;
        adjustWhiteBall();
    }
    logic.motion();
    logic.generation();
    adjustBlackBall();
    if (logic.collision(getCollisionParameter())) {
        gameFinished();
    }
}

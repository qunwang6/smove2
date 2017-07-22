/*
deal with the color changing of background
you can alter the colors by modifying the bgColor array
 */

let bgAlterProceedIntervalID;
let proceed = 0;
let bgColor = ["#00bfff", "#6495ed", "#db7093", "#ff8c00", "#3cb371"];
let curColor = -1;
let grad = 0.2;

function nextColor(curColor) {
    if (curColor === bgColor.length - 1) {
        return 0;
    }
    else {
        return curColor + 1;
    }
}

function bgAlterProceed() {
    proceed += 2;
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    let canvasUp = document.getElementById("bg_up");
    let canvasMid = document.getElementById("bg_mid");
    let canvasDown = document.getElementById("bg_down");

    canvasUp.width = canvasMid.width = canvasDown.width = clientWidth;
    canvasUp.height = clientHeight * proceed / 100;
    canvasMid.height = clientHeight * grad;
    if (canvasUp.height + canvasMid.height > clientHeight) {
        canvasMid.height = clientHeight - canvasUp.height;
    }
    canvasDown.height = clientHeight - canvasUp.height - canvasMid.height;

    canvasUp.style.left = canvasMid.style.left = canvasDown.style.left = "0px";
    canvasUp.style.top = "0px";
    canvasMid.style.top = String(canvasUp.height) + "px";
    canvasDown.style.top = String(canvasUp.height + canvasMid.height) + "px";

    let ctxUp = canvasUp.getContext("2d");
    ctxUp.strokeStyle = ctxUp.fillStyle = bgColor[nextColor(curColor)];
    ctxUp.fillRect(0, 0, canvasUp.width, canvasUp.height);

    let ctxMid = canvasMid.getContext("2d");
    let gradfill = ctxMid.createLinearGradient(0, 0, 0, canvasMid.height);
    gradfill.addColorStop(0, bgColor[nextColor(curColor)]);
    gradfill.addColorStop(1, bgColor[curColor]);
    ctxMid.fillStyle = gradfill;
    ctxMid.fillRect(0, 0, canvasMid.width, canvasMid.height);

    let ctxdown = canvasDown.getContext("2d");
    ctxdown.strokeStyle = ctxdown.fillStyle = bgColor[curColor];
    ctxdown.fillRect(0, 0, canvasDown.width, canvasDown.height);

    if (proceed >= 100) {
        window.clearInterval(bgAlterProceedIntervalID);
        document.body.style.backgroundColor = bgColor[nextColor(curColor)];
    }
}

function bgAlter() {
    curColor = nextColor(curColor);
    proceed = 0;
    if (bgAlterProceedIntervalID) window.clearInterval(bgAlterProceedIntervalID);
    bgAlterProceedIntervalID = window.setInterval(bgAlterProceed, 20);
}

function bgRestore() {
    curColor = bgColor.length - 1;
    proceed = 98;
    bgAlterProceed();
}
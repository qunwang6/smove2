/*
the statement of basic items
white ball, black ball, score items and logic
 */

let Whiteball = function(_gridX, _gridY) {
    this.gridX = _gridX;
    this.gridY = _gridY;
    this.spdX = 0.0;
    this.spdY = 0.0;
    this.rest = 0;
    this.restMax = 3;
};

let Blackball = function(_posX, _posY, _spdX, _spdY, _bnc) {
    this.posX = _posX;
    this.posY = _posY;
    this.spdX = _spdX;
    this.spdY = _spdY;
    this.bounce = _bnc;

    this.outBoard = function() {
        return ((this.posX < 0. || this.posX > 1. || this.posY < 0. || this.posY > 1.) && this.bounce === 0);
    };

    this.motion = function(dX, dY) {
        this.posX += this.spdX;
        this.posY += this.spdY;
        if (this.posX < dX && this.spdX < 0 && this.bounce > 0) {
            this.posX = dX * 2 - this.posX;
            this.spdX = -this.spdX;
            --this.bounce;
        }
        if (this.posX > 1. - dX && this.spdX > 0 && this.bounce > 0) {
            this.posX = (1. - dX) * 2 - this.posX;
            this.spdX = -this.spdX;
            --this.bounce;
        }
        if (this.posY < dY && this.spdY < 0 && this.bounce > 0) {
            this.posY = dY * 2 - this.posY;
            this.spdY = -this.spdY;
            --this.bounce;
        }
        if (this.posY > 1. - dY && this.spdY > 0 && this.bounce > 0) {
            this.posY = (1. - dY) * 2 - this.posY;
            this.spdY = -this.spdY;
            --this.bounce;
        }
    };
};

let Item = function(_gridX, _gridY) {
    while (true) {
        let p = Math.floor(Math.random() * 3);
        let q = Math.floor(Math.random() * 3);
        if (Math.abs(p - _gridX) + Math.abs(q - _gridY) > 1) {
            this.gridX = p;
            this.gridY = q;
            break;
        }
    }
    this.ang = Math.floor(Math.random() * 360);
};

let Logic = function() {
    this.paused = false;
    this.alive = true;
    this.score = 0;
    this.best = 0;
    this.level = 1;
    this.levelMaxBallCount = [3, 3, 4, 4, 4];
    this.levelBallBounce = [4, 0, 0, 0, 0];
    this.levelBallChoice = [1, 0, 0, 0, 0];
    this.levelProb = [99, 20, 16, 12, 10, 8, 6, 5, 4];
    this.levelRest = [99, 40, 35, 30, 20, 15, 12, 10, 8];
    this.whiteballRatio = 0.6;
    this.blackballRatio = 0.75;
    this.blackballSpeed = 0.01;
    this.blackballID = 0;
    this.blackballCount = 0;
    this.verticalRatio = 0.;
    this.bounceRatioX = 0.;
    this.bounceRatioY = 0.;
    this.genRest = 0;
    this.itemRatio = 0.3;
    this.whiteball = new Whiteball(1, 1);
    this.item = new Item(1, 1);
    this.blackballs = {}; // k-v pair k: black ball id; v: position
    this.birthplace = [];

    this.shift = function(dx, dy) {
        if (this.whiteball.gridX + dx >= 0 && this.whiteball.gridX + dx <= 2 &&
            this.whiteball.gridY + dy >= 0 && this.whiteball.gridY + dy <= 2) {
            this.whiteball.gridX += dx;
            this.whiteball.gridY += dy;
            this.whiteball.spdX = dx / this.whiteball.restMax;
            this.whiteball.spdY = dy / this.whiteball.restMax;
            this.whiteball.rest = this.whiteball.restMax;
        }
    };

    this.eat = function() {
        return this.whiteball.gridX === this.item.gridX && this.whiteball.gridY === this.item.gridY;
    };

    this.generateItem = function() {
        ++this.score;
        if (this.score > this.best) {
            this.best = this.score;
        }
        this.item = new Item(this.whiteball.gridX, this.whiteball.gridY);
    };

    this.rotateItem = function() {
        this.item.ang += 1;
        if (this.item.ang === 360) this.item.ang = 0;
    };

    this.canWhiteBallMove = function() {
        return this.whiteball.rest === 0 && this.paused === false;
    };

    this.clear = function() {
        this.paused = false;
        this.alive = true;
        this.score = 0;
        this.level = 1;
        this.whiteball = new Whiteball(1, 1);
        this.item = new Item(1, 1);
        this.blackballs = {};
        this.blackballID = 0;
        this.blackballCount = 0;
        this.genRest = 0;
    };

    this.motion = function() {
        for (let i in this.blackballs) {
            let blackball = this.blackballs[i];
            blackball.motion(this.bounceRatioX, this.bounceRatioY);
            if (blackball.outBoard()) {
                delete(this.blackballs[i]);
                --this.blackballCount;
            }
        }
    };

    this.getInteger = function(x, y) {
        return Math.floor(Math.random() * (y - x + 1)) + x;
    };

    this.getFloat = function(x, y) {
        return Math.random() * (y - x) + x;
    };

    this.getBlackBall = function(pos, choice, bounce, spdMul = 1.) {
        let pX = this.birthplace[pos][0];
        let pY = this.birthplace[pos][1];
        let speedVec;
        if (choice === 0) {
            speedVec = (this.birthplace[pos][2] + this.birthplace[pos][3]) / 2;
        }
        else {
            speedVec = this.getFloat(this.birthplace[pos][2], this.birthplace[pos][3]);
        }
        let ang = speedVec / 180. * Math.PI;
        let spdX = Math.cos(ang) * this.blackballSpeed;
        let spdY = -Math.sin(ang) * this.blackballSpeed * this.verticalRatio;
        spdX *= spdMul;
        spdY *= spdMul;
        return new Blackball(pX, pY, spdX, spdY, bounce);
    };

    this.generation = function() {
        let lv = this.level % 5;
        let difficulty = Math.floor((this.level - 1) / 5) + 1;
        if (difficulty > 8) {
            difficulty = 8;
        }
        if (this.genRest > 0) {
            --this.genRest;
        }
        if (this.genRest === 0 && this.blackballCount < this.levelMaxBallCount[lv] * difficulty) {
            if (lv === 1) {
                let canGen = this.getInteger(0, this.levelProb[difficulty]);
                if (canGen === 0) {
                    let pos = this.getInteger(0, 11);
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos, this.levelBallChoice[lv], this.levelBallBounce[lv]);
                    this.genRest = this.levelRest[difficulty];
                }
            }
            else if (lv === 2) {
                let canGen = this.getInteger(0, this.levelProb[difficulty]);
                if (canGen === 0) {
                    let pos = this.getInteger(0, 5);
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos, this.levelBallChoice[lv], this.levelBallBounce[lv]);
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos + 6, this.levelBallChoice[lv], this.levelBallBounce[lv]);
                    this.genRest = this.levelRest[difficulty];
                }
            }
            else if (lv === 3) {
                let canGen = this.getInteger(0, this.levelProb[difficulty]);
                if (canGen === 0) {
                    let pos;
                    while (true) {
                        pos = this.getInteger(0, 11);
                        if (pos % 3 !== 2) break;
                    }
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos, this.levelBallChoice[lv], this.levelBallBounce[lv]);
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos + 1, this.levelBallChoice[lv], this.levelBallBounce[lv], 1.5);
                    this.genRest = this.levelRest[difficulty];
                }
            }
            else if (lv === 4) {
                let canGen = this.getInteger(0, this.levelProb[difficulty]);
                if (canGen === 0) {
                    let pos;
                    while (true) {
                        pos = this.getInteger(0, 11);
                        if (pos % 3 !== 2) break;
                    }
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos, this.levelBallChoice[lv], this.levelBallBounce[lv]);
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos + 1, this.levelBallChoice[lv], this.levelBallBounce[lv]);
                    this.genRest = this.levelRest[difficulty];
                }
            }
            else {
                let canGen = this.getInteger(0, this.levelProb[difficulty]);
                if (canGen === 0) {
                    let pos = this.getInteger(0, 11);
                    ++this.blackballCount;
                    this.blackballs[++this.blackballID] = this.getBlackBall(pos, this.levelBallChoice[lv], this.levelBallBounce[lv], 1.5);
                    this.genRest = this.levelRest[difficulty];
                }
            }
        }
    };

    this.intersect = function(x0, y0, r0, x1, y1, r1) {
        let p = (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
        let q = (r0 + r1) * (r0 + r1);
        return p < q;
    };

    this.collision = function(args) {
        let boardWidth = args[0];
        let boardHeight = args[1];
        let canvasLeft = args[2];
        let canvasTop = args[3];
        let gridSize = args[4];

        let whiteX = canvasLeft + (this.whiteball.gridX - this.whiteball.spdX * this.whiteball.rest) * gridSize + gridSize / 2;
        let whiteY = canvasTop + (this.whiteball.gridY - this.whiteball.spdY * this.whiteball.rest) * gridSize + gridSize / 2;
        let whiteR = gridSize * this.whiteballRatio / 2;
        let blackR = gridSize * this.blackballRatio / 2;

        for (let i in this.blackballs) {
            let black = this.blackballs[i];
            let blackX = -blackR + (boardWidth + blackR * 2) * black.posX;
            let blackY = -blackR + (boardHeight + blackR * 2) * black.posY;
            if (this.intersect(whiteX, whiteY, whiteR, blackX, blackY, blackR)) {
                return true;
            }
        }
        return false;
    };
};

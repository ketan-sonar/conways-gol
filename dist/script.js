"use strict";
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const COLS = 30;
const ROWS = 30;
const WIDTH = CELL_WIDTH * COLS;
const HEIGHT = CELL_HEIGHT * ROWS;
const FPS = 10;
let running = false;
function fillBoard(board, x) {
    for (let r = 0; r < ROWS; ++r) {
        board[r] = [];
        for (let c = 0; c < COLS; ++c) {
            board[r][c] = x;
        }
    }
}
function fillBoardWithPredicate(board, predicate) {
    for (let r = 0; r < ROWS; ++r) {
        board[r] = [];
        for (let c = 0; c < COLS; ++c) {
            board[r][c] = predicate();
        }
    }
}
let board = [];
fillBoard(board, 0);
function countNbors(board, r, c) {
    let count = 0;
    for (let i = -1; i < 2; ++i) {
        for (let j = -1; j < 2; ++j) {
            count += board[(r + i + ROWS) % ROWS][(c + j + COLS) % COLS];
        }
    }
    count -= board[r][c];
    return count;
}
function update() {
    let newBoard = [];
    for (let r = 0; r < ROWS; ++r) {
        newBoard[r] = [];
        for (let c = 0; c < COLS; ++c) {
            const count = countNbors(board, r, c);
            switch (board[r][c]) {
                case 0:
                    if (count === 3)
                        newBoard[r][c] = 1;
                    else
                        newBoard[r][c] = 0;
                    break;
                case 1:
                    if (count < 2)
                        newBoard[r][c] = 0;
                    else if (count > 3)
                        newBoard[r][c] = 0;
                    else
                        newBoard[r][c] = 1;
                    break;
            }
        }
    }
    board = newBoard;
}
function draw(ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let r = 0; r < ROWS; ++r) {
        for (let c = 0; c < COLS; ++c) {
            const x = c * CELL_WIDTH;
            const y = r * CELL_HEIGHT;
            ctx.fillStyle = "white";
            ctx.fillRect(x - 1, y - 1, 1, 1);
            if (board[r][c] == 1) {
                ctx.fillRect(x + 1, y + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
            }
        }
    }
}
function getCellFromCoords(x, y) {
    const r = Math.floor((y / WIDTH) * ROWS);
    const c = Math.floor((x / WIDTH) * COLS);
    return [r, c];
}
const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
canvas.addEventListener("click", (event) => {
    if (running)
        return;
    const [r, c] = getCellFromCoords(event.offsetX, event.offsetY);
    board[r][c] = board[r][c] === 1 ? 0 : 1;
    draw(ctx);
});
function nextFrame() {
    update();
    draw(ctx);
    if (running)
        setTimeout(() => window.requestAnimationFrame(nextFrame), 1000 / FPS);
}
const randomizeBtn = document.getElementById("randomize");
randomizeBtn.addEventListener("click", (_) => {
    if (running)
        return;
    fillBoardWithPredicate(board, () => (Math.random() > 0.5 ? 1 : 0));
    draw(ctx);
});
const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", (_) => {
    if (running)
        return;
    fillBoard(board, 0);
    draw(ctx);
});
const startStopBtn = document.getElementById("startStop");
startStopBtn.addEventListener("click", (_) => {
    if (startStopBtn.innerText === "Start") {
        startStopBtn.innerText = "Stop";
        running = true;
        randomizeBtn.disabled = true;
        randomizeBtn.style.opacity = "50%";
        clearBtn.disabled = true;
        clearBtn.style.opacity = "50%";
    }
    else {
        startStopBtn.innerText = "Start";
        running = false;
        randomizeBtn.disabled = false;
        randomizeBtn.style.opacity = "100%";
        clearBtn.disabled = false;
        clearBtn.style.opacity = "100%";
    }
    nextFrame();
});
nextFrame();

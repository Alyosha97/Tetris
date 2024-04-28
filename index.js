let main = document.querySelector('.main');
let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let gameBoard = [];

for(let i = 0; i < 20; i++) {
    gameBoard.push(Array(10).fill(0))
}

let gameSpeed = 500;
let gameTimerID;
let isPaused = true;

let figures = {

  O: [
      [1, 1],
      [1, 1],
  ],
  I: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
}

let activeTetro = getNewTetro();

function draw() {
  let mainInnerHtml = '';
  for(let y = 0; y < gameBoard.length; y++) {
    for(let x = 0; x < gameBoard[y].length; x++){
      if (gameBoard[y][x] === 1) {
        mainInnerHtml += '<div class="cell movingCell"></div>'
      } else if (gameBoard[y][x] === 2) {
        mainInnerHtml += '<div class="cell fixedCell"></div>'
      } else {
        mainInnerHtml += '<div class="cell"></div>'
      } 
    }
  }
  main.innerHTML = mainInnerHtml
}

function removePrevActiveTetro() {
  for(let y = 0; y < gameBoard.length; y++) {
    for(let x = 0; x < gameBoard[y].length; x++){
      if (gameBoard[y][x] === 1) {
        gameBoard[y][x] = 0;
      }
    }
  }
}

function addActiveTetro() {
  removePrevActiveTetro()
  for(let y = 0; y < activeTetro.shape.length; y++) {
    for(let x = 0; x < activeTetro.shape[y].length; x++){
      if (activeTetro.shape[y][x] === 1) {
        gameBoard[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
      }
    }
  }
}

function rotateTetro() {
  const prevTetroState = activeTetro.shape;
  activeTetro.shape = activeTetro.shape[0].map((elem, index) => 
  activeTetro.shape.map((row) => row[index]).reverse()
);

  if(hasCollisions()) {
    activeTetro.shape = prevTetroState;
  }
}

function hasCollisions() {
  for(let y = 0; y < activeTetro.shape.length; y++) {
    for(let x = 0; x < activeTetro.shape[y].length; x++) {
      if (activeTetro.shape[y][x] && (gameBoard[activeTetro.y + y] === undefined || 
          gameBoard[activeTetro.y + y] [activeTetro.x + x] === undefined || 
          gameBoard[activeTetro.y + y] [activeTetro.x + x] === 2)
        ) {
        return true;
      }
    }
  }
  return false;
}


function checkFullLines() {
  let canRemoveLine = true;
  for(let y = 0; y < gameBoard.length; y++) {
    for(let x = 0; x < gameBoard[y].length; x++){
      if (gameBoard[y][x] !== 2) {
        canRemoveLine = false;
        break;
      }
    }
    if (canRemoveLine) {
        gameBoard.splice(y, 1);
        gameBoard.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    canRemoveLine = true;
  }
}

function fixTetro() {
  for(let y = 0; y < gameBoard.length; y++) {
    for(let x = 0; x < gameBoard[y].length; x++){
      if (gameBoard[y][x] === 1) {
        gameBoard[y][x] = 2
      }
    }
  }
}

function getNewTetro() {
  const possibleFigures = 'IOLJTSZ';
  const rand = Math.floor(Math.random() * 7);
  const newTetro = figures[possibleFigures[rand]];

  return {
    x: Math.floor((10 - newTetro[0].length) / 2),
    y: 0,
    shape: newTetro,
  }
}

function moveTetroDown() {
  if(!isPaused) {
    activeTetro.y += 1;
    if(hasCollisions()) {
      activeTetro.y -= 1;
      fixTetro();
      checkFullLines();
      activeTetro = getNewTetro();
      if(hasCollisions()) {
        alert("GAME OVER");
        isPaused = true;
        clearTimeout(gameTimerID);
      }
    };
  }
}

document.addEventListener("keydown",(e) => {
  if (!isPaused) {
    if (e.keyCode === 37) {
      activeTetro.x -= 1;
      if (hasCollisions()) {
        activeTetro.x += 1;
      }
    } else if (e.keyCode === 39) {
      activeTetro.x += 1;
      if (hasCollisions()) {
        activeTetro.x -= 1;
      }
    } else if (e.keyCode === 40) {
      moveTetroDown()
    } else if (e.keyCode === 38) {
      rotateTetro();
    } 

    addActiveTetro();
    draw();
  }
});

pauseBtn.addEventListener("click", (e) => {
  if (e.target.innerHTML === 'Pause') {
    e.target.innerHTML = 'Keep Playing...';
    clearTimeout(gameTimerID);
  } else {
    e.target.innerHTML = 'Pause';
    gameTimerID = setTimeout(startGame, gameSpeed);
  }
  isPaused = !isPaused;
})

draw();

startBtn.addEventListener("click", () => {
  isPaused = false;
  gameTimerID = setTimeout(startGame, gameSpeed);
})

function startGame() {
  if(!isPaused) {
    moveTetroDown();
    addActiveTetro();
    draw();
    gameTimerID = setTimeout(startGame, gameSpeed);
  }
}



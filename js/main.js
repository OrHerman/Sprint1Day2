'use strict';

const MINE = '💣';
const FLAG = '🚩';
var mins = 2;
var secs = mins * 60;

var gBoard;

var gChosenLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gEmptyCells;

// Runs the game.
function initGame() {
    preventContentMenu();
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    gEmptyCells = [];
    gBoard = createMat(gChosenLevel.SIZE);
    renderBoard(gBoard);
    
}

// Sets the level that the user chose.
function setChosenLevel(elLevel) {
    var level = +(elLevel.id);
    gChosenLevel.SIZE = level;
    var mines;
    if (level === 4) {
        mines = 2;
    }
    if (level === 8) {
        mines = 12;
    }
    if (level === 12) {
        mines = 30;
    }
    gChosenLevel.MINES = mines;
    initGame();
}

// Called when a cell (td) is clicked.
function cellClicked(event) {
    var cell = event.target;
    var i = cell.id.split('-')[1];
    var j = cell.id.split('-')[2];
    var currCell = gBoard[i][j];
    if (!gGame.isOn) {
        gGame.isOn = true;
        getEmptyCells(gBoard);
        for (var k = 0; k < gEmptyCells.length; k++) {
            var currPos = gEmptyCells[k];
            if (currPos.i === +i && currPos.j === +j) {
                gEmptyCells.splice(k, 1);
                break;
            }
        }
        gBoard = insertMines(gBoard);
        setMinesNegsCount(gBoard);
        console.log(currCell.minesAroundCount);
        renderCell(cell, currCell.minesAroundCount);
    }

    if (!event.button) {
        if (currCell.isMarked) return;
        if (currCell.isShown) return;
        currCell.isShown = true;
        gGame.shownCount++;
        if (!currCell.isMine) renderCell(cell, currCell.minesAroundCount);
        else {
            cell.style.backgroundColor = 'red';
            renderCell(cell, MINE);
            gameOver();
            setTimeout(function(){ alert("You Lost!"); }, 300);
        }
        if (!currCell.isMine && !currCell.minesAroundCount) getBoardLevel(gBoard, { i: +i, j: +j });
    }
    else if (event.button === 2) cellMarked(cell, +i, +j);
    setTimeout(checkGameStatus, 100);
}

// Called on right click to mark a cell.
function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    cell.isMarked = !cell.isMarked;
    console.log(cell);
    if (cell.isMarked) {
        renderCell(elCell, FLAG);
        gGame.markedCount++;
        console.log(gGame.markedCount);
    } else {
        renderCell(elCell, '');
        gGame.markedCount--;
        console.log(gGame.markedCount);
    }
}

// render a cell with mine value.
function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            var tableCell = document.querySelector(`#cell-${i}-${j}`);
            if (currCell.isMine) renderCell(tableCell, MINE);
        }
    }
    
}

// Checks if the game is done and shows a winner sign.
function checkGameStatus() {
    if (gChosenLevel.SIZE ** 2 - gChosenLevel.MINES === gGame.shownCount) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                var currCell = gBoard[i][j];
                if (currCell.isMine) {
                    var cell = document.querySelector(`#cell-${i}-${j}`);
                    renderCell(cell, FLAG);
                }
            }
        }
        alert('Won this time, try a harder level!');
    }
}

// Selects in which size the of board the game will run. 
function getBoardLevel(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === pos.i && j === pos.j) continue;
            var currCell = board[i][j];
            if (!currCell.isShown) {
                currCell.isShown = true;
                gGame.shownCount++;
                var cellToRender = document.querySelector(`#cell-${i}-${j}`);
                renderCell(cellToRender, currCell.minesAroundCount);
            }
        }
    }
}

// Render a cell.
function renderCell(cell, value) {
    cell.innerText = value;
}
// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            cell.minesAroundCount = countMinesAround({ i, j }, board)
        }
    }
}
// Counter for the mines-neighnours.
function countMinesAround(pos, board) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (i === pos.i && j === pos.j) continue;

            var cell = board[i][j];
            if (cell.isMine) count++;
        }
    }
    return count;
}

// Render the board.
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board.length; j++) {
            strHTML += `<td id="cell-${i}-${j}" onmouseup="cellClicked(event)"></td>`
        }
        strHTML += '</tr>\n'
        console.log('strHTML');
    }
    console.log(strHTML);
    var elTable = document.querySelector('tbody');
    elTable.innerHTML = strHTML;
}

// Inserting mines randomly.
function insertMines(board) {
    for (var i = 0; i < gChosenLevel.MINES; i++) {
        var pos = getEmptyCell();
        board[pos.i][pos.j].isMine = true;
    }
    return board;
}

// Creates a matrix
function createMat(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board;
}

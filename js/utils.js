
//Google Timer

const timer = document.getElementById('stopwatch');

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
    if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime == false) {
        sec = parseInt(sec);
        min = parseInt(min);
        hr = parseInt(hr);

        sec = sec + 1;

        if (sec == 60) {
            min = min + 1;
            sec = 0;
        }
        if (min == 60) {
            hr = hr + 1;
            min = 0;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
            min = '0' + min;
        }
        if (hr < 10 || hr == 0) {
            hr = '0' + hr;
        }

        timer.innerHTML = hr + ':' + min + ':' + sec;

        setTimeout("timerCycle()", 1000);
    }
}



// reset google timer.
function resetTimer() {
    timer.innerHTML = '00:00:00';
}





// random number.
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}






// from pacman.
function getEmptyCell() {

    var randIdx = getRandomNum(0, gEmptyCells.length - 1);
    return gEmptyCells.splice(randIdx, 1)[0];
}





// from pacman.
function getEmptyCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            gEmptyCells.push({ i, j });
        }
    }

}





// Important - from class
function preventContentMenu() {
    var elBody = document.querySelector('body');
    elBody.addEventListener('contentmenu', event1 => { event1.preventDefault() });
}






// Returns a copy pf the mat - chess.
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}










// Returns a random mat - baller game.
function getRandomMatrix(rows, cols) {
    var mat = [];
    for (var i = 0; i < rows; i++) {
        mat[i] = [];
        for (var j = 0; j < cols; j++) {
            mat[i][j] = (getRandomNum());
        }
    }
    return mat;
}







// Returns a random color - from pacman
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



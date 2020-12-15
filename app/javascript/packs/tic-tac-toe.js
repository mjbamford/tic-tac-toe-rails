function Game() {
    // this = {}
    const _board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    let _current = 'x',
        _isFinished = false;

    function isOccupied(row, col) {
        return Boolean(_board[row][col]);
    }

    function occupy(row, col) {
        if (_isFinished) { return }
        _board[row][col] = _current;
    }

    function isWinningRow(row) {
        let notNullRow = row.filter(Boolean);

        let uniqRow = notNullRow.filter((el, idx) => (
            notNullRow.indexOf(el) === idx
        ));

        return (notNullRow.length === 3 && uniqRow.length === 1)
    }

    function isWinner() {
        // For each horizontal row
        // - check for three symbols (i no nulls)
        // - check for one unique symbol

        // Row check for winner
        for (let row of _board) {
            _isFinished = isWinningRow(row);
            if (_isFinished) { return _isFinished }
        }

        // Column check for winner
        let transposedBoard = _board[0].map((_, colIndex) => (
            _board.map(row => row[colIndex])
        ));

        for (let row of transposedBoard) {
            _isFinished = isWinningRow(row);
            if (_isFinished) { return _isFinished }
        }

        // Diagonals check
        // ...

        return _isFinished;
    }

    function isDraw() {
        // let flattenBoard = _board.flat().filter(Boolean);
        // return (flattenBoard.length === 9 && !isWinner());
        let game = JSON.stringify(_board);
        let url = `/game/draw.json?game=${encodeURIComponent(game)}`;

        fetch(url)
            .then(response => response.json() )
            .then(json => console.dir(json));

        return undefined;
    }

    function isFinished() {
        _isFinished = isWinner() || isDraw();
        return _isFinished;
    }

    this.next = function() {
        if (_isFinished) { return }

        _current = (_current === 'x') ? 'o' : 'x'
        return _current;
    }

    this.turn = function(id) {
        if (_isFinished) { return }

        id -= 1;
        let row = Math.floor(id / 3),
            col = id % 3;

        if (!isOccupied(row, col)) {
            occupy(row,col);
            return { current: _current, isWinner: isWinner(), isDraw: isDraw() }
        }
    }

    // this.__proto__ = Game.prototype
    // return this;
};

let game = new Game();

document.addEventListener('DOMContentLoaded', function () {
    const handler = function (event) {
        const id = event.target.id,
                turn = game.turn(id);

        if (turn) {
            event.target.textContent = turn.current;
            if (turn.isWinner) {
                console.log(`${turn.current} is the winner!`);
            } else if (turn.isDraw) {
                console.log('A draw :(');
            } else {
                game.next();
            } 
        }
    };

    const table = document.querySelector('table');
    table.addEventListener('click', handler);
});
(function() {
    "use strict";

    const gameDiv = document.getElementById("game-board");
    let modal = document.getElementById("modal");

    let gridSize = 4; // initial grid size
    // hold all tiles as a grid
    // i th column hold j th row, tileGrid[i] gives the row
    let tileGrid = [];
    let emptyPosition = { x: gridSize - 1, y: gridSize - 1 }; // initial position of the empty tile

    // HTML document is completely loaded
    document.addEventListener("DOMContentLoaded", function() {
        resetLevel(gridSize);
        initListeners();
    });

    function initListeners() {
        document.getElementById("easy").addEventListener("click", () => resetLevel(3));
        document.getElementById("medium").addEventListener("click", () => resetLevel(4));
        document.getElementById("hard").addEventListener("click", () => resetLevel(5));

        document.getElementById("numberInput").addEventListener("input", (event) => {
            let number = event.target.value;
            if (number && parseInt(number) > 2) { // minimum grid size is 3
                resetLevel(parseInt(number));
            }
        });
        document.getElementById("playAgain").addEventListener("click", () => {
            resetLevel(gridSize);
            modal.style.display = "none";
        });
        document.getElementById("close").addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // reset level for a new game
    function resetLevel(count) {
        gridSize = count;
        emptyPosition = { x: gridSize - 1, y: gridSize - 1 };
        gameDiv.replaceChildren(); // remove all existing children
        gameDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // dynamically setting the grid columns

        resetTiles();

        // assign shuffle click listener
        document.getElementById("shuffle").addEventListener("click", shuffle);
        // assing click listener for all tiles
        tileGrid.flat().forEach(tile => tile.addEventListener("click", onTileClick));
    }

    /**
     * remove all tiles from the board and re-create again.
     * maintain all the tiles in a grid (tileGrid).
     */
    function resetTiles() {
        tileGrid = [];
        for (let i = 0; i < gridSize; i++) {
            tileGrid[i] = []; // i th row
            for (let j = 0; j < gridSize; j++) {
                let tile = document.createElement("div");
                tile.classList.add("tile");
                tile.textContent = i * gridSize + j + 1;

                if (i === gridSize - 1 && j === gridSize - 1) { // last tile is empty
                    tile.classList.add("tile-empty");
                    tile.textContent = "";
                }

                // maintain tile position as data-x, data-y
                tile.dataset.x = j;
                tile.dataset.y = i;
    
                tileGrid[i][j] = tile;
                gameDiv.appendChild(tile);
            }
        }
    }

    function onTileClick(event) {
        const tile = event.target;
        const value = tile.textContent;
        if (value) { // don't allow to move when click on the empty tile
            const x = parseInt(tile.dataset.x);
            const y = parseInt(tile.dataset.y);
            if (canMove(x, y)) {
                swapEmptyTile(x, y);
                if (hasWon()) {
                    modal.style.display = "flex";
                }
            }
        }
    }

    // a tile can move in four directions: up, right, down, left
    // a tile can move only if the empty tile is adjecent
    function canMove(x, y) {
        const right = ((x + 1) === emptyPosition.x && y === emptyPosition.y);
        const left = ((x - 1) === emptyPosition.x && y === emptyPosition.y);
        const up = (x === emptyPosition.x && (y - 1) === emptyPosition.y);
        const down = (x === emptyPosition.x && (y + 1) === emptyPosition.y);
        return (left || right || up || down);
    }

    // swap/move the tile into empty tile position and move the empty tile into the selected tile's position
    function swapEmptyTile(x, y) {
        let tile = tileGrid[y][x];
        let value = tile.textContent;
        let emptyTile = tileGrid[emptyPosition.y][emptyPosition.x];
        emptyTile.classList.remove("tile-empty");
        emptyTile.textContent = value;

        tile.textContent = "";
        tile.classList.add("tile-empty");

        emptyPosition = { x, y }; // assign selected tile's position as empty postion after the swap
    }

    // shuffle the board when the shuffle button clicked. A random number is used to decide the move direction
    function shuffle() {
        for (let i = 0; i < 50 * gridSize; i++) { // 50 is an arbitary number to shuffle properly
            const { x, y } = emptyPosition;
            const direction = parseInt(Math.random() * 4); // there are 4 directions, obviousely
            if (direction === 0 && y > 0) { // up
                swapEmptyTile(x, y - 1);
            } else if (direction === 1 && x < gridSize - 1) { // right
                swapEmptyTile(x + 1, y);
            } else if (direction === 2 && y < gridSize - 1) { // down
                swapEmptyTile(x, y + 1);
            } else if (direction === 3 && x > 0) { //left
                swapEmptyTile(x - 1, y);
            }
        }
    }

    function hasWon() {
        // flattening the 2d grid array and map the number
        // remove the last element as we expect last element to be empty in winning state
        let numbers = tileGrid.flat().map(tile => parseInt(tile.textContent)).slice(0, -1);
        // every number should be 1 higher than the previous number except for the first index
        return numbers.every((value, index) => index === 0 || numbers[index - 1] === value - 1);
    }
})();

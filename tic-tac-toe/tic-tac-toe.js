(function() {
    /**
     * 0, 1, 2
     * 3, 4, 5
     * 6, 7, 8
     */
    const winCombinations = [
        [ 0, 1, 2 ], // rows
        [ 3, 4, 5 ],
        [ 6, 7, 8 ],
        [ 0, 3, 6 ], // columns
        [ 1, 4, 7 ],
        [ 2, 5, 8 ],
        [ 0, 4, 8 ], // cross
        [ 2, 4, 6 ],
    ];

    // Modal elements
    const modal = document.getElementById("winModal");
    const closeModal = document.querySelector(".close");
    const newGameButton = document.getElementById("newGameButton");
    const modalMessage = document.getElementById("modalMessage");

    let cells = Array.from(document.querySelectorAll(".game-container > div"));

    cells.forEach(cell => cell.addEventListener("click", onCellClick));

    function onCellClick(event) {
        let cell = event.target;
        if (!cell.textContent) {
            cell.textContent = "X";

            if (checkWin()) {
                showWinDialog("Player X wins!");
                return;
            }
            if (cells.some(cell => !cell.textContent)) {
                moveComputer();
                if (checkWin()) {
                    showWinDialog("Player O wins!");
                }
            } else {
                showWinDialog("It's a draw!");
            }
        }
    }

    function moveComputer() {
        const emptyCells = cells.filter(cell => !cell.textContent);
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        if (randomCell) randomCell.textContent = "O";
    }

    function checkWin() {
        return winCombinations.some(combination => {
            const [a, b, c] = combination;
            const cellA = cells[a].textContent;
            const cellB = cells[b].textContent;
            const cellC = cells[c].textContent;
            return cellA && cellA === cellB && cellA === cellC;
        });
    }

    // win dialog
    function showWinDialog(message) {
        modalMessage.textContent = message;
        modal.style.display = "flex";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
        resetGame();
    }

    newGameButton.onclick = function() {
        modal.style.display = "none";
        resetGame();
    }

    function resetGame() {
        cells.forEach(cell => cell.textContent = "");
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            resetGame();
        }
    }
})();
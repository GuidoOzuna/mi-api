function createBoard() {
  const board = document.getElementById("sudoku-board");
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("input");
    cell.type = "text";
    cell.maxLength = 1;
    board.appendChild(cell);
  }
}

function checkSudoku() {
  const cells = document.querySelectorAll("#sudoku-board input");
  let valid = true;
  cells.forEach(cell => {
    const val = cell.value;
    if (val && (val < "1" || val > "9")) {
      valid = false;
    }
  });
  alert(valid ? "Todo correcto (valores válidos)" : "Error: solo números 1-9");
}

createBoard();

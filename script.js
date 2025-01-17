/*
** 'z': no marker is in the square,
** 'x': Player 1's marker,
** 'o': Player 2's marker
*/


function Cell() {
    let value = '-';

    // Accept a player's token to change the value of the cell
    const markCell = (player) => {
        value = player;
    };

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return {
        markCell,
        getValue
    };
}


/*
** The Gameboard represents the state of the board
** Each square holds a Cell (defined above)
** and we expose a markSquare method to be able to update values of squares
*/

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    // This nested-loop technique is a simple and common way to create a 2d array.

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }


    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;


    const UpdateSquareValue = (row, column, player) => {
        if (board[row][column].getValue() === 'x' || board[row][column].getValue() === 'o') {
            console.log('Cell already occupied!');
            return false;
        } else {
            board[row][column].markCell(player);
            return true;
        }
    };

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.table(boardWithCellValues);
    };

    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, UpdateSquareValue, printBoard };
}

// let myboard = Gameboard();


/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    let board = Gameboard();
    const resetBoard = () => {
        board = null;
    }

    const players = [
        {
            name: playerOneName,
            marker: 'x'
        },
        {
            name: playerTwoName,
            marker: 'o'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    let myboard = board.getBoard();
    const playRound = (row, column) => {
        // Mark a square for the current player
        if (board) {
            console.log(
                `Marking ${getActivePlayer().name}'s square in row ${row} column ${column}...`
            );
            board.UpdateSquareValue(row, column, getActivePlayer().marker);

            // Check for a winner
            let [winnerCheck, winnerCoordinates] = checkWinner(myboard, row, column, getActivePlayer().marker);
            console.log({ winnerCheck, winnerCoordinates });
            let flattenedBoard = myboard.flat();
            const marked_cells = flattenedBoard.filter((innerItem) => innerItem.getValue() === 'o' || innerItem.getValue() === 'x');

            if (winnerCheck === true) {
                board.printBoard();
                console.log(`${getActivePlayer().name} WINS!!!`);
                // playAgain();
                return [winnerCheck, winnerCoordinates, marked_cells.length];
            } else if (winnerCheck === false && marked_cells.length >= 9) {
                board.printBoard();
                console.log('WELL PLAYED, GAME IS TIED!');
                document.getElementById('winAnnounced').textContent = 'WELL PLAYED, GAME IS TIED!';
                // playAgain();
                return [winnerCheck, winnerCoordinates, marked_cells.length];
            } else if (winnerCheck === false && marked_cells.length < 9) {
                console.log('game on');
                switchPlayerTurn();
                printNewRound();
                return [winnerCheck, winnerCoordinates, marked_cells.length];

            }
        } else {
            console.log('start a new game');
        }

    };

    // Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        resetBoard,
        switchPlayerTurn
    };
}




function checkWinner(myboard, base_row, base_column, player_marker) {
    base_row = parseInt(base_row);
    base_column = parseInt(base_column);
    //Check row and column
    console.log({ base_row, base_column, player_marker });
    //get row  array & array  coordinates
    let base_row_array = myboard[base_row].map((cell) => cell.getValue());
    let row_array_coordinates = [];
    for (let i = 0; i < myboard[base_row].length; i++) {
        row_array_coordinates.push({ 'row': base_row, 'column': i });
    }
    //get column array & array coordinates
    let base_column_array = myboard.map((row) => row[base_column].getValue());
    let column_array_coordinates = [];
    for (let i = 0; i < myboard.length; i++) {
        column_array_coordinates.push({ 'row': i, 'column': base_column });
    }
    //get Diagonal Array & Coordinates Array
    const MAXIMUM_COLUMN_INDEX = 2;
    const MINIMUM_COLUMN_INDEX = 0;
    const MAXIMUM_ROW_INDEX = 2;
    const MINIMUM_ROW_INDEX = 0;
    // We have 2 diagonal arrays. 1 is right-up diagonal, 2 is left-up diagonal.
    // right up diagonal- lower end is defined by column decrement, row increment.
    // right up diagonal - upper end is defined by column increment, row decrement.

    //lower end coordinates
    let ruLowerEndRow = base_row;
    let ruLowerEndColumn = base_column;
    while ((ruLowerEndRow >= MINIMUM_ROW_INDEX && ruLowerEndRow < MAXIMUM_ROW_INDEX) && (ruLowerEndColumn > MINIMUM_COLUMN_INDEX && ruLowerEndColumn <= MAXIMUM_COLUMN_INDEX)) {
        ruLowerEndRow++;
        ruLowerEndColumn--;
    }
    // console.log({ruLowerEndRow, ruLowerEndColumn});

    //upper end coordinates
    let ruUpperEndRow = base_row;
    let ruUPPerEndColumn = base_column;
    while ((ruUpperEndRow > MINIMUM_ROW_INDEX && ruUpperEndRow <= MAXIMUM_ROW_INDEX) && (ruUPPerEndColumn >= MINIMUM_COLUMN_INDEX && ruUPPerEndColumn < MAXIMUM_COLUMN_INDEX)) {
        ruUpperEndRow--;
        ruUPPerEndColumn++;
    }
    // console.log({ruUpperEndRow, ruUPPerEndColumn});

    //RIGHT UP ARRAY and ARRAY COORDINATES
    let rightUpArray = [];
    let rightUPArrayCoordinates = [];

    if (ruLowerEndRow - ruUpperEndRow >= 1) {
        let k = ruUPPerEndColumn;
        for (let i = ruUpperEndRow; i <= ruLowerEndRow; i++) {
            rightUpArray.push(myboard[i][k].getValue());
            rightUPArrayCoordinates.push({ 'row': i, 'column': k });
            k--;
        }
    }

    // LEFT UP DIAGONAL - Lower end is defined by column increment, row increment
    // LEFT UP DIAGONAL - Upper end is defined by column decrement, row decrement

    // Lower end coordinates
    let luLowerEndRow = base_row;
    let luLowerEndColumn = base_column;
    while ((luLowerEndRow >= MINIMUM_ROW_INDEX && luLowerEndRow < MAXIMUM_ROW_INDEX) && (luLowerEndColumn >= MINIMUM_COLUMN_INDEX && luLowerEndColumn < MAXIMUM_COLUMN_INDEX)) {
        luLowerEndRow++;
        luLowerEndColumn++;
    }

    // console.log({luLowerEndRow, luLowerEndColumn});

    // Upper end coordinates
    let luUpperEndRow = base_row;
    let luUpperEndColumn = base_column;
    while ((luUpperEndRow > MINIMUM_ROW_INDEX && luUpperEndRow <= MAXIMUM_ROW_INDEX) && (luUpperEndColumn > MINIMUM_COLUMN_INDEX && luUpperEndColumn <= MAXIMUM_COLUMN_INDEX)) {
        luUpperEndRow--;
        luUpperEndColumn--;
    }

    // console.log({luUpperEndRow, luUpperEndColumn});

    //LEFT UP ARRAY and ARRAY COORDINATES
    let leftUpArray = [];
    let leftUPArrayCoordinates = [];

    if (luLowerEndRow - luUpperEndRow >= 1) {
        let j = luUpperEndColumn;
        for (let i = luUpperEndRow; i <= luLowerEndRow; i++) {
            leftUpArray.push(myboard[i][j].getValue());
            leftUPArrayCoordinates.push({ 'row': i, 'column': j });
            j++;
        }
    }

    let all_array = [];

    const CreateArrayObject = (name, content = [], coordinates = []) => {
        const winningClaim = () => {
            return (`Winning matches found in  ${name} - ${content}`);
        };
        return ({ name, content, coordinates, winningClaim });
    }

    all_array.push(CreateArrayObject('Row_array', base_row_array, row_array_coordinates));
    all_array.push(CreateArrayObject('Column_array', base_column_array, column_array_coordinates));
    all_array.push(CreateArrayObject('Right_Up_Array', rightUpArray, rightUPArrayCoordinates));
    all_array.push(CreateArrayObject('Left_Up_Array', leftUpArray, leftUPArrayCoordinates));
    console.log(all_array);

    // Checking an Array to find the perfect 3
    const WinningArray = (player_marker, current_array) => {
        let number_of_token_in_a_row = 0;
        if (current_array.length >= 3) {
            for (let i = 0; i < current_array.length; i++) {
                // console.log(player_marker, current_array[i]);
                if (current_array[i] === player_marker) {
                    number_of_token_in_a_row++;
                } else {
                    number_of_token_in_a_row = 0;
                }
                // console.log(number_of_token_in_a_row);
                if (number_of_token_in_a_row >= 3) {
                    return true;
                }
            }
        }
        return false;
    }

    // checking for a win
    for (let i = 0; i < all_array.length; i++) {
        if (WinningArray(player_marker, all_array[i].content) === true) {
            return [true, all_array[i].coordinates];
        }
    }

    return [false, null];


    // return(all_array);


}



// Display intro Screen.
function initiateIntroScreen() {
    const introScreen = document.getElementById('intro_screen');
    // const containerDiv = document.querySelector('.container');
    // const boardDiv = document.querySelector('.board');
    const gameSetDiv = document.getElementById('gameSet');
    const twoPlayersMode = document.getElementById('twoPlayersMode');
    const playerVComputer = document.getElementById('playerVComputer');
    const twoplay = document.getElementById('twoplay');
    const versusComputer = document.getElementById('versusComp');
    const cancelButtons = document.querySelectorAll('.cancel');
    gameSetDiv.style.display = 'none';


    cancelButtons.forEach(function (cancelButton) {
        cancelButton.onclick = () => {
            twoPlayersMode.style.display = 'none';
            playerVComputer.style.display = 'none';
            versusComputer.disabled = false;
            twoplay.disabled = false;

        }
    });

    twoPlayersMode.style.display = 'none';
    playerVComputer.style.display = 'none';
    introScreen.style.display = 'block';
    // containerDiv.style.display = 'none';
    // boardDiv.style.display = 'none';

    twoplay.onclick = () => {
        versusComputer.disabled = true;
        twoPlayersMode.style.display = 'block';
        playerVComputer.style.display = 'none';
        twoplay.disabled = true;
    }

    versusComputer.onclick = () => {
        playerVComputer.style.display = 'block';
        twoPlayersMode.style.display = 'none';
        versusComputer.disabled = true;
        twoplay.disabled = true;
    }

    const submitButton2player = document.getElementById('submit2P');
    const submitButtonPlayerVComputer = document.getElementById('submitPVC');
    const playerName = document.getElementById('playerName');
    const playerOneName = document.getElementById('playerOne');
    const playerTwoName = document.getElementById('playerTwo');
    let name_of_player_one = '';
    let name_of_player_two = '';
    let game = '';
    submitButton2player.onclick = (event) => {
        event.preventDefault();
        name_of_player_one = playerOneName.value;
        name_of_player_two = playerTwoName.value;
        console.log({ name_of_player_one, name_of_player_two });
        playerOneName.value = '';
        playerTwoName.value = '';
        introScreen.style.display = 'none';
        gameSetDiv.style.display = 'block';
        game = ScreenController(name_of_player_one, name_of_player_two);
    }

    submitButtonPlayerVComputer.onclick = (event) => {
        event.preventDefault();
        //who is player one?
        let myIndex = [1, 2];
        let humanIndex = myIndex[Math.floor(Math.random() * myIndex.length)];
        if (humanIndex === 1) {
            name_of_player_one = playerName.value;
            name_of_player_two = 'computer___computer';
        } else {
            name_of_player_one = 'computer___computer';
            name_of_player_two = playerName.value;
        }
        console.log({ name_of_player_one, name_of_player_two });
        playerName.value = '';
        introScreen.style.display = 'none';
        gameSetDiv.style.display = 'block';
        game = ScreenController(name_of_player_one, name_of_player_two);
        // console.log({game});
    }

}



initiateIntroScreen();




function ScreenController(gamer1, gamer2) {
    let game = GameController(gamer1, gamer2);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, index) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.column = index;
                cellButton.dataset.row = rowIndex;
                if (cell.getValue() === '-') {
                    cellButton.textContent = '';
                } else if (cell.getValue() === 'x') {
                    cellButton.textContent = 'X';
                } else if (cell.getValue() === 'o') {
                    cellButton.textContent = 'O';
                }
                boardDiv.appendChild(cellButton);
            })
        })
    }
    winAnnounced = document.getElementById('winAnnounced');
    function computersTurn(){
      if(game.getActivePlayer().name === 'computer___computer'){
        const board = game.getBoard();
        console.log('We are Here!!!');
        let flattened_board = board.flat();
        const filled_cells_check = flattened_board.filter((innerItem) => innerItem.getValue() === 'o' || innerItem.getValue() === 'x');
        let selectedColumn = Math.floor(Math.random()*3);
        let selectedRow = Math.floor(Math.random()*3);


        while (filled_cells_check.length < 9 && (board[selectedRow][selectedColumn].getValue() === 'x' || board[selectedRow][selectedColumn].getValue() === 'o')){
            selectedColumn = Math.floor(Math.random()*3);
            selectedRow = Math.floor(Math.random()*3);
        }

        let [winnerState, winningCoords, filled_cells_length] = [];
        if(filled_cells_check.length < 9 && board[selectedRow][selectedColumn].getValue() === '-'){
          [winnerState, winningCoords, filled_cells_length] = game.playRound(selectedRow, selectedColumn);
          updateScreen();
          checkForAWin(winnerState, winningCoords, filled_cells_length);
        }

      }
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        // const activePlayer = game.getActivePlayer();
        
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        console.log({selectedRow, selectedColumn});
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn && !selectedRow) return;
        let [winnerState, winnerCoordinates, marked_cells_length] = []
        if (selectedColumn && selectedRow){
            [winnerState, winnerCoordinates, marked_cells_length] = game.playRound(selectedRow, selectedColumn);
        } else {
            console.log('Not our concern');
        }
        

        updateScreen();
        checkForAWin(winnerState, marked_cells_length, winnerCoordinates);
        setTimeout(computersTurn, 1000);
        // computersTurn();


    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    

    function checkForAWin(winstate, filled_cells, winningthree){
      const activePlayer = game.getActivePlayer();
      if(winstate === true){
        winAnnounced.textContent = `${activePlayer.name} WINS!!!!!!`;
        //WORK HERE!!!!
        console.log(winningthree);
        for(let i = 0; i < winningthree.length; i++){

          winningbox = boardDiv.querySelector(`.cell[data-row="${winningthree[i].row}"][data-column="${winningthree[i].column}"]`);
          console.log(winningbox);
          winningbox.style.border = '8px solid #051936';
          console.log("I'm here");
        }

        game.resetBoard();

      } else if (winstate === false && filled_cells === 9){
        winAnnounced.textContent = 'WELL PLAYED, GAME IS TIED';
        game.resetBoard();
      }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min); // Round up to the nearest integer
        max = Math.floor(max); // Round down to the nearest integer
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // let playAgainValue = false;

    const playAgain = document.getElementById('playAgain');
    playAgain.onclick = () => {
        console.log('PLAY AGAIN CLICKED!!!');
        winAnnounced.textContent = '';
        game.resetBoard();
        // Just to randomize the playing order when a new game begins
        let randomNumber = getRandomInt(1, 20)
        if(randomNumber % 2 === 0){
            game = GameController(gamer1, gamer2);
        }else{
            game = GameController(gamer2, gamer1);
        }
        
        updateScreen();
        setTimeout(computersTurn, 1000);
    };

    const exitGame = document.getElementById('exitGame');
    exitGame.onclick = () => {
        winAnnounced.textContent = '';
        game.resetBoard();
        document.getElementById('gameSet').style.display = 'none';
        document.getElementById('intro_screen').style.display = 'block';
        const twoPlayersMode = document.getElementById('twoPlayersMode');
        const playerVComputer = document.getElementById('playerVComputer');
        const twoplay = document.getElementById('twoplay');
        const versusComputer = document.getElementById('versusComp');
        twoPlayersMode.style.display = 'none';
        playerVComputer.style.display = 'none';
        versusComputer.disabled = false;
        twoplay.disabled = false;

    }




    // Initial render
    updateScreen();
    setTimeout(computersTurn, 1000);
    // computersTurn();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}


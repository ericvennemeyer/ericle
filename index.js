// TODO: Refactor document queries for "allKeys" into separate function?


// Global var to store current solution
let CURR_WORD = "";
// Global var to store user guess as it is being entered
let CURR_GUESS = "";
// Global var to track index in master word list
let WORD_INDEX = 0;
// Global var to hold game state (true/false)
let IS_PLAYING = true;
// Global var to hold message modal
let MODAL;

document.addEventListener('DOMContentLoaded', () => {

    // Query for message modal
    MODAL = document.querySelector(".modal-content");

    // Initialize new game
    startGame();

    // Add event listener to entire page to catch keyboard input
    document.addEventListener('keydown', event => parseInput(event.key));

    // Add event listeners to each virtual key to catch clicks
    const allKeys = document.querySelectorAll(".key");
    allKeys.forEach(key => {
        const keyValue = key.dataset.letter;
        key.addEventListener('click', () => parseInput(keyValue));
    })
    
});

function parseInput(key) {

    // Check that game is active
    if (!IS_PLAYING) {
        startGame();
    } else {
        // Set message modal display mode to 'none' whenever key is pressed
        MODAL.style.display = 'none';

        // Make sure active row animation is set to ""
        const activeRow = getActiveRow();
        activeRow.dataset.animation = "";

        // Convert key input to upper case, and then to ASCII code
        const currKey = key.toUpperCase();
        const keyCode = currKey.charCodeAt(0);

        // Parse whether input is delete, enter, or a letter guess
        if (currKey == 'BACKSPACE' || currKey == 'DELETE') {
            deleteLetter();
        }
        else if (currKey == 'ENTER') {
            evaluateWord();
        }
        else if ((keyCode >= 65 && keyCode <= 90) && currKey.length == 1) {

            CURR_GUESS += currKey;

            // Make sure we can't enter more than 5 letters per word
            if (CURR_GUESS.length > 5) {
                CURR_GUESS = CURR_GUESS.slice(0, -1);
            } else {
                addLetter(currKey);
            }
        }
    }
}

function addLetter(letter) {

    // Query for currently active row
    const activeRow = getActiveRow();
    // Query for the currently active tile in the currently active row
    const activeTile = activeRow.querySelector(".game-tile[data-active='true']");

    // Change state of current tile to active='false'
    activeTile.dataset.active = 'false';

    // Change text of currently active tile to currKey
    activeTile.firstElementChild.textContent = letter;

    // Add letter to tile's data-letter
    activeTile.dataset.letter = letter;

    // Add animation
    activeTile.dataset.animation = "pop";

    // If word length is less than five, get next tile after current one and change state to active='true'
    if (CURR_GUESS.length < 5) {
        activeTile.nextElementSibling.dataset.active = 'true';
    }
}

function deleteLetter() {

    // Query for currently active row
    const activeRow = getActiveRow();

    // Query within currently active row for all tiles with letters in them
    const tiles = Array.from(activeRow.querySelectorAll(".game-tile"));
    const result = tiles.filter(tile => tile.textContent != "");

    // If there is a non-zero number of tiles with letters... 
    if (result.length > 0) {
        // Query for currently active tile. If one exists, set its active state to 'false'
        if (activeRow.querySelector(".game-tile[data-active='true']")) {
            const activeTile = activeRow.querySelector(".game-tile[data-active='true']");
            activeTile.dataset.active = 'false';
        }
        // ...set the textContent of last active tile in array to empty and set its active state to 'true'
        const lastEntered = result[result.length - 1];
        lastEntered.firstElementChild.textContent = "";
        lastEntered.dataset.active = 'true';
        // Remove letter from tile's data-letter
        lastEntered.dataset.letter = "";
        // Set data-animation back to none
        lastEntered.dataset.animation = "";
        // Don't forget to remove the deleted letter from CURRWORD!
        CURR_GUESS = CURR_GUESS.slice(0, -1);
    }
}

function evaluateWord() {

    // Query for currently active row
    const activeRow = getActiveRow();
    // Query for all tiles in currently active row
    const tiles = activeRow.querySelectorAll('.game-tile');
    // Create array from tiles list
    const tilesArray = Array.from(tiles);
    
    // Make sure submitted guess is 5 chars long
    if (CURR_GUESS.length < 5) {
        activeRow.dataset.animation = "shake";
        displayMessage("Not Enough Letters");
    } else {
        // If current guess is correct...
        if (CURR_GUESS == CURR_WORD) {
            for (let i = 0; i < 5; i++) {
                const currLetter = tilesArray[i].dataset.letter;

                // Set temp color/status 
                tilesArray[i].dataset.tempStatus = "correct";
                    
                // Set color/status for key in virtual keyboard
                document.querySelector(`#keyboard div[data-letter=${currLetter}]`).dataset.status = "correct";

                animateReveal(tilesArray, i);
            }

            displayMessage("You Win!");
            IS_PLAYING = false;

        } else {
            // Go through each letter of guess and compare to solution (avoids double-counting letters):

            // Copy CURRWORD to temp var for comparison below
            let tempWord = CURR_WORD;

            for (let i = 0; i < 5; i++) {
                // Store current letter of CURRGUESS string in var currLetter
                const currLetter = tilesArray[i].dataset.letter;
                // If the guessed letter is in the right position...
                if (currLetter == tempWord[i]) {
                    // Remove "correct" letter from tempWord
                    tempWord = tempWord.replace(currLetter, " ");

                    // Set temp color/status 
                    tilesArray[i].dataset.tempStatus = "correct";
                    
                    // Set color/status for key in virtual keyboard
                    document.querySelector(`#keyboard div[data-letter=${currLetter}]`).dataset.status = "correct";
                }
                // If the guessed letter is in the word, but in a different position...
                else if (tempWord.includes(currLetter)) {
                    // Remove "present" letter from tempWord
                    tempWord = tempWord.replace(currLetter, " ");

                    tilesArray[i].dataset.tempStatus = "present";
                    document.querySelector(`#keyboard div[data-letter=${currLetter}]`).dataset.status = "present";
                }
                // If the guessed letter is not in the word...
                else {
                    tilesArray[i].dataset.tempStatus = "wrong";
                    document.querySelector(`#keyboard div[data-letter=${currLetter}]`).dataset.status = "wrong";
                }
                
                animateReveal(tilesArray, i);
            }
        }

        // Reset to next row:
        // Clear CURRGUESS
        CURR_GUESS = "";

        // Set currently active row state to 'false'
        activeRow.dataset.active = 'false';
        
        // If this is not the last row...
        if (activeRow.nextElementSibling) {
            // Set the next row and next row's first game tile active states to 'true'
            const nextRow = activeRow.nextElementSibling;
            nextRow.dataset.active = 'true';
            const firstTile = nextRow.firstElementChild;
            firstTile.dataset.active = 'true';
        } else {
            // Player loses. On click, clear the game board and start back at the top
            displayMessage("You Lose");
            IS_PLAYING = false;
        }

    }

}

function animateReveal(tilesArray, index) {
    if (index > 0) {
        tilesArray[index - 1].firstElementChild.addEventListener('animationend', () => {
            modifyTileAttributes(tilesArray, index);
        });
    } else {
        modifyTileAttributes(tilesArray, index);
    }
}

function modifyTileAttributes(tilesArray, index) {
    tilesArray[index].dataset.animation = "flip";
    tilesArray[index].firstElementChild.dataset.animation = "flip";
    setTimeout(() => {
        tilesArray[index].dataset.status = tilesArray[index].dataset.tempStatus;
    }, 275);
}

function displayMessage(message) {

    // Query for modal text element and set text to content of message
    MODAL.querySelector(".modal-text").textContent = message;
    // Make modal visible
    MODAL.style.display = 'block';

}

function startGame() {

    // Set solution word for this game
    // TODO: add word list
    CURR_WORD = "CYNIC";

    // Set IS_PLAYING to true
    IS_PLAYING = true;

    // Set message modal display mode to 'none'
    MODAL.style.display = 'none';

    // Clear CURRGUESS
    CURR_GUESS = "";

    // Query for all game tiles and clear out text content, data-letter, data-status, and data-animation attributes
    const allTiles = document.querySelectorAll(".game-tile");
    allTiles.forEach(tile => {
        tile.firstElementChild.textContent = "";
        tile.dataset.letter = "";
        tile.dataset.tempStatus = "";
        tile.dataset.status = "";
        tile.dataset.animation = "";
        tile.firstElementChild.dataset.animation = "";
    })

    // Query for all virtual keys and clear out data-status attribute
    const allKeys = document.querySelectorAll(".key");
    allKeys.forEach(key => {
        key.dataset.status = "";
    })

    // Query for first row and first tile in that row, and set active states to 'true'
    const firstRow = document.querySelector(".game-row");
    firstRow.dataset.active = 'true';
    firstRow.firstElementChild.dataset.active = 'true';

}

function getActiveRow() {

    if (document.querySelector(".game-row[data-active='true']")) {
        return document.querySelector(".game-row[data-active='true']");
    } else {
        return false;
    }
    
}
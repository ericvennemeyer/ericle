// Create global var to store word as it is being entered
let CURRWORD = "";

document.addEventListener('DOMContentLoaded', () => {

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

    // Set error modal display mode to 'none' whenever key is pressed
    const modal = document.querySelector(".modal-content");
    modal.style.display = 'none';

    // Make sure active row animation is set to ""
    const activeRow = getActiveRow();
    activeRow.dataset.animation = "";

    const currKey = key.toUpperCase();
    const keyCode = currKey.charCodeAt(0);

    if (currKey == 'BACKSPACE' || currKey == 'DELETE') {
        deleteLetter();
    }
    else if (currKey == 'ENTER') {
        evaluateWord();
    }
    else if ((keyCode >= 65 && keyCode <= 90) && currKey.length == 1) {

        CURRWORD += currKey;

        if (CURRWORD.length > 5) {
            CURRWORD = CURRWORD.slice(0, -1);
        } else {
            addLetter(currKey);
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

    // Change text of currently active tile to currKey in uppercase
    activeTile.textContent = letter;

    // Add letter to tile's data-letter
    activeTile.dataset.letter = letter;

    // Add animation
    activeTile.dataset.animation = "pop";

    // If word length is less than five, get next tile after current one and change state to active='true'
    if (CURRWORD.length < 5) {
        console.log("CURRWORD length: ", CURRWORD.length);
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
        // ...set the textContent of last tile in array to empty and set its active state to 'true'
        const lastEntered = result[result.length - 1];
        lastEntered.textContent = "";
        lastEntered.dataset.active = 'true';
        // Remove letter from tile's data-letter
        lastEntered.dataset.letter = "";
        // Set data-animation back to none
        lastEntered.dataset.animation = "";
        // Don't forget to remove the deleted letter from CURRWORD!
        CURRWORD = CURRWORD.slice(0, -1);
    }
}

function evaluateWord() {

    // Query for currently active row
    const activeRow = getActiveRow();
    
    if (CURRWORD.length < 5) {
        activeRow.dataset.animation = "shake";
        const message = "Not Enough Letters";
        displayError(message);
    } else {

        // TODO: word eval logic goes here //////////////////////////////////////

        // Clear CURRWORD
        CURRWORD = "";

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
            // Clear the game board and start back at the top
            resetBoard();
        }
    }

}

function displayError(message) {

    // Query for modal 
    const modal = document.querySelector(".modal-content");
    // Query for modal text element and set text to content of message
    modal.querySelector(".modal-text").textContent = message;
    // Make modal visible
    modal.style.display = 'block';

    // Make modal invisible when mouse clicked
    window.onclick = function() {
        modal.style.display = 'none';
    }

}

function resetBoard() {

    // Clear CURRWORD
    CURRWORD = "";

    // Query for all game tiles and clear out text content
    const allTiles = document.querySelectorAll(".game-tile");
    allTiles.forEach(tile => {
        tile.textContent = "";
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
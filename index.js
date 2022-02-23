// Create global var to store word as it is being entered
let CURRWORD = "";

document.addEventListener('DOMContentLoaded', () => {

    // Add event listener to entire page to catch keyboard input
    document.addEventListener('keydown', event => parseInput(event.key));

    // Add event listeners to each virtual key to catch clicks
    // TODO
    
});

function parseInput(key) {

    const currKey = key.toUpperCase();
    const keyCode = currKey.charCodeAt(0);

    if (currKey == 'BACKSPACE' || currKey == 'DELETE') {
        deleteLetter();
    }
    else if (keyCode >= 65 && keyCode <= 90) {

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
    const activeRow = document.querySelector(".game-row[data-active='true']");
    // Query for the currently active tile in the currently active row
    const activeTile = activeRow.querySelector(".game-tile[data-active='true']");

    // Change state of current tile to active='false'
    activeTile.dataset.active = 'false';

    // Change text of currently active tile to currKey in uppercase
    activeTile.textContent = letter;

    // If word length is less than five, get next tile after current one and change state to active='true'
    if (CURRWORD.length < 5) {
        activeTile.nextElementSibling.dataset.active = 'true';
    }
}

function deleteLetter() {

    // Query for currently active row
    const activeRow = document.querySelector(".game-row[data-active='true']");

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
        // Don't forget to remove the deleted letter from CURRWORD!
        CURRWORD = CURRWORD.slice(0, -1);
    }
}

function evaluateWord(currWord) {
    
    // TODO

}

function displayError(message) {

    // TODO

}
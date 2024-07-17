// constant assignments
const defaultDiskSize = 168;
const easy = "e"
const medium = "m";
const hard = "h";
const easyTime = 60;
const easyNumOfDirect = 3;
const easyNumOfIndirect = 1;
const easyNumOfDouble = 1;
const easyNumOfAddressesPerBlock = 5;
const mediumTime = 30;
const mediumNumOfDirect = 5;
const mediumNumOfIndirect = 2;
const mediumNumOfDouble = 1;
const mediumNumOfAddressesPerBlock = 10;
const hardTime = 20;
const hardNumOfDirect = 8;
const hardNumOfIndirect = 2;
const hardNumOfDouble = 1;
const hardNumOfAddressesPerBlock = 12;

const divider = ';';
const type = 't:';
const previous = 'p:';
const next = 'n:';
const emptyBlock = '_';
const directBlock = 'd';
const indirectBlock = 'i';
const doubleBlock = 'o';
const directClass = "info";
const indirectClass = "warning";
const doubleClass = "success";

// html elements assignment
const timerElement = $('#timer');
const scoreElement = $('#score');
const targetScoreElement = $('#target-score');
const gridContainer = $('#grid-container');
const fileSizeElement = $('#file-size-value');
const fileNameElement = $('#file-name');
const storeButton = $('#store-button');
const addDirectButton = $('#add-direct-button');
const addIndirectButton = $('#add-indirect-button');
const addDoubleButton = $('#add-double-button');
const indexButton = $('#index-button');
const dataButton = $('#data-button');
const errorMessageElement = $('#error-message');
const incomingFileCard = $('#incoming-file-card');
const instructionsElement = $('#instructions');
const startButton = $('#start-button');
const gameContainer = $('#game-container');
const numOfAddressesElement = $('#num-of-addresses');

let selectedPointer = null;
let score = 0;
let countdownInterval;
let currentFile = { name: '', size: 0 };

const files = [
    { name: 'notes.txt', size: 87 },
    { name: 'report.pdf', size: 58 },
    { name: 'image.jpg', size: 67 },
    { name: 'video.mp4', size: 88 },
    { name: 'presentation.ppt', size: 53 },
    { name: 'spreadsheet.xlsx', size: 61 },
    { name: 'document.docx', size: 45 },
    { name: 'archive.zip', size: 79 },
    { name: 'audio.mp3', size: 40 },
    { name: 'script.js', size: 49 },
    { name: 'style.css', size: 50 },
    { name: 'database.sql', size: 64 },
    { name: 'config.json', size: 44 },
    { name: 'log.txt', size: 52 },
    { name: 'data.csv', size: 65 },
    { name: 'vector.svg', size: 41 },
    { name: 'animation.gif', size: 68 },
    { name: 'readme.md', size: 43 },
    { name: 'project.tar', size: 76 },
    { name: 'font.ttf', size: 57 },
    { name: 'backup.bak', size: 81 },
    { name: 'template.html', size: 66 },
    { name: 'spreadsheet.ods', size: 40 },
    { name: 'model.obj', size: 74 },
    { name: 'presentation.key', size: 46 },
    { name: 'drawing.dwg', size: 70 },
    { name: 'map.kml', size: 55 },
    { name: 'ebook.epub', size: 48 },
    { name: 'presentation.odp', size: 60 },
    { name: 'calendar.ics', size: 41 }
];

const gameStates = {
    waiting: { id: 0, name: 'waiting', description: 'Waiting for the player to start the game.' },
    playing: { id: 1, name: 'playing', description: 'You are currently playing the game.' },
    won: { id: 2, name: 'won', description: 'You have won the game.' },
    lossMoreDirectBlocksThanAvailable: { id: 3, name: 'lossMoreDirectBlocksThanAvailable', description: 'You have used more direct blocks than available.' },
    lossMoreIndirectBlocksThanAvailable: { id: 4, name: 'lossMoreIndirectBlocksThanAvailable', description: 'You have used more indirect blocks than available.' },
    lossMoreDoubleBlocksThanAvailable: { id: 5, name: 'lossMoreDoubleBlocksThanAvailable', description: 'You have used more double blocks than available.' },
    lossDidNotUseAllDirectBlocks: { id: 6, name: 'lossDidNotUseAllDirectBlocks', description: 'You did not use all direct blocks available.' },
    lossDidNotUseAllIndirectBlocks: { id: 7, name: 'lossDidNotUseAllIndirectBlocks', description: 'You did not use all indirect blocks available.' },
    lossDidNotUseAllDoubleBlocks: { id: 8, name: 'lossDidNotUseAllDoubleBlocks', description: 'You did not use all double blocks available.' },
    lossDidNotUseAllDirectBlocksInIndirect: { id: 9, name: 'lossDidNotUseAllDirectBlocksInIndirect', description: 'You did not use all direct blocks available in each indirect block.' },
    lossMoreDirectIndirectThanAvailable: { id: 10, name: 'lossMoreDirectIndirectThanAvailable', description: 'You have used more direct blocks in an indirect block than available.' },
    lossWrongFileSize: { id: 11, name: 'lossWrongFileSize', description: 'The data blocks you have used add up to the wrong file size.' },
    lossTimeUp: { id: 12, name: 'lossTimeUp', description: 'You have run out of time.' },
}

$(document).ready(() => {
    $(".toast").toast("show");
    readyGame();
});

function selectPointer(pointerType, index) {
    selectedPointer = { type: pointerType, index: index };
}

///////////////////////// GAME LOGIC /////////////////////////

function readyGame() {
    getAndSetDifficultyParams();
    initialiseUi();
}

function getAndSetDifficultyParams() {                              // Get the difficulty parameter from the URL
    let urlParams = new URLSearchParams(window.location.search);
    setDifficultyParams(urlParams.get('d'));
}

function setDifficultyParams(difficulty) {
    diskSize = defaultDiskSize;
    loadNextFile();
    if (difficulty == easy) {
        time = easyTime;
        numOfDirect = easyNumOfDirect;
        numOfIndirect = easyNumOfIndirect;
        numOfDouble = easyNumOfDouble;
        numOfAddressesPerBlock = easyNumOfAddressesPerBlock;
    } else if (difficulty == hard) {
        time = hardTime;
        numOfDirect = hardNumOfDirect;
        numOfIndirect = hardNumOfIndirect;
        numOfDouble = hardNumOfDouble;
        numOfAddressesPerBlock = hardNumOfAddressesPerBlock;
    } else {
        time = mediumTime;
        numOfDirect = mediumNumOfDirect;
        numOfIndirect = mediumNumOfIndirect;
        numOfDouble = mediumNumOfDouble;
        numOfAddressesPerBlock = mediumNumOfAddressesPerBlock;
    }
    blockBoard = [];
    for (let i = 0; i < diskSize; i++) {
        blockBoard.push(type + emptyBlock + divider);
    }
}

function loadNextFile() {                            // Load the next file 
    currentFile = files[Math.floor(Math.random() * files.length)];
}

function initialiseUi() {
    initializeHeader();
    initializeFileContainer();
    initializeInodes();
    drawBoard(blockBoard);
}

function initializeHeader() {
    timerElement.text(`Time: ${time}`);
    scoreElement.text(`Files Stored: ${score}`);
}

function initializeFileContainer() {
    fileSizeElement.text(currentFile.size);
    fileNameElement.text(currentFile.name);
}

function initializeInodes() {
    $('#inode-empty').css('display', 'none');
    $('#inode-body').css('display', 'block');
    $('#inode-body').empty();
    $('#num-of-addresses').text(numOfAddressesPerBlock);

    initializeInodeContainer(directBlock, "Direct", numOfDirect, 'bg-info-subtle', 'text-info-emphasis', addDirect, removeDirect);
    initializeInodeContainer(indirectBlock, "Indirect", numOfIndirect, 'bg-warning-subtle', 'text-warning-emphasis', addIndirect, removeIndirect);
    initializeInodeContainer(doubleBlock, "Double Indirect", numOfDouble, 'bg-success-subtle', 'text-success-emphasis', addDouble, removeDouble);
}

function initializeInodeContainer(type, name, num, bgClass, textClass, addFunc, removeFunc) {
    for (let i = 0; i < num; i++) {
        const block = $('<div></div>').attr('id', `inode-${type}-` + i).addClass(`p-3 ${type} ${bgClass} ${textClass}`); // To position the label inside the block
        const label = $('<span></span>').text(`${name} Block Pointer ` + (i + 1));
        block.append(label);
        const addBtn = $('<button></button>').attr('id', `add-${type}-` + i).addClass(`btn btn-${type} btn-sm py-0`).text('+').css('float', 'right'); // Align button to the right
        addBtn.on('click', (btn) => addFunc(btn, i)); // Add event listener
        block.append(addBtn);
        const removeBtn = $('<button></button>').attr('id', `remove-${type}-` + i).addClass(`btn btn-${type} btn-sm py-0 d-none`).text('-').css('float', 'right'); // Align button to the right
        removeBtn.on('click', (btn) => removeFunc(btn, i)); // Add event listener
        block.append(removeBtn);
        const divider = $('<div></div>').addClass(`w-100 bg-light`).css('height', '2px'); // To position the label inside the block

        if (type == indirectBlock){
            block.append(generateAddressInput(indirectBlock, i, handleIndirectAddressChange));
        } else if (type == doubleBlock) {
            block.append(generateAddressInput(doubleBlock, i, handleDoubleddressChange));
        }

        $('#inode-body').append(divider);
        $('#inode-body').append(block);
    }
}

startButton.on('click', () => startGame())

function startGame() {
    $('#end-screen').hide();
    instructionsElement.hide();
    gameContainer.show();
    countdownInterval = setInterval(countdown, 1000);
}

function countdown() {
    if (time > 0) {
        time--;
        timerElement.text(`Time: ${time}`);
    } else {
        clearInterval(countdownInterval);
        finishGame(gameStates.lossTimeUp);
    }
}

storeButton.on('click', () => {
    let finalState = getFinalGameState(currentFile.size, numOfAddressesPerBlock, numOfDirect, numOfIndirect, numOfDouble, blockBoard);
    clearInterval(countdownInterval);
    finishGame(finalState);
});

function finishGame(state) {
    if (state == gameStates.won) {
        $('#game-state-text').text("You won!").css('color', 'green');
        $('#game-state-description').text(state.description);
    } else {
        $('#game-state-text').text("You lost. Try again.").css('color', 'red');
        $('#game-state-description').text(state.description);
    }
    
    $('#end-screen').fadeIn();
}

function getFinalGameState(fileSize, numOfAddressesPerBlock, numOfDirectAvailable, numOfIndirectAvailable, numOfDoubleAvailable, blocks) {
    let remainingSize = fileSize;
    let numOfDirectUsed = 0;
    let numOfIndirectUsed = 0;
    let numOfDoubleUsed = 0;  

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].includes(directBlock) && !blocks[i].includes(previous)) {
            numOfDirectUsed++;
            remainingSize--;
        }
    }

    if (numOfDirectUsed > numOfDirectAvailable) {
        return gameStates.lossMoreDirectBlocksThanAvailable;
    }

    if ((remainingSize > 0 && numOfDirectUsed < numOfDirectAvailable)) {
        return gameStates.lossDidNotUseAllDirectBlocks;
    }
    
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].includes(indirectBlock) && !blocks[i].includes(previous)) {
            numOfIndirectUsed++;
            let numOfIndirectDirect = getAllChildIndexes(blocks, i).length;
            if (numOfIndirectDirect > numOfAddressesPerBlock) {
                return gameStates.lossMoreDirectIndirectThanAvailable;
            }
            remainingSize -= numOfIndirectDirect;
            if (remainingSize > 0 && numOfIndirectDirect < numOfAddressesPerBlock) {
                return gameStates.lossDidNotUseAllDirectBlocksInIndirect;
            }
        }
    }

    if (numOfIndirectUsed > numOfIndirectAvailable) {
        return gameStates.lossMoreIndirectBlocksThanAvailable;
    }
    
    if (remainingSize > 0 && numOfIndirectUsed < numOfIndirectAvailable) {
        return gameStates.lossDidNotUseAllIndirectBlocks;
    }

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].includes(doubleBlock) && !blocks[i].includes(previous)) {
            numOfDoubleUsed++;
            let childIndexes = getAllChildIndexes(blocks, i);
            let doubleDirectIndexes = childIndexes.filter((idx) => blocks[idx].includes(directBlock));
            remainingSize -= doubleDirectIndexes.length;
        }
    }

    if (numOfDoubleUsed > numOfDoubleAvailable) {
        return gameStates.lossMoreDoubleBlocksThanAvailable;
    }

    if (remainingSize > 0 && numOfDoubleUsed < numOfDoubleAvailable) {
        return gameStates.lossDidNotUseAllDoubleBlocks;
    }

    return remainingSize == 0 ? gameStates.won : gameStates.lossWrongFileSize;
}

// function addDirect(btn, i) {
//     let earliestIndex = getEarliestEmptyBlock(blockBoard);
//     blockBoard[earliestIndex] = type + directBlock + divider;
//     $(`#inode-${directBlock}-${i}`).attr('data-index', earliestIndex);
//     $(`#add-${directBlock}-${i}`).addClass('d-none');
//     $(`#remove-${directBlock}-${i}`).removeClass('d-none');
//     drawBoard(blockBoard);
// }

///////////// Personal Changes ///////////////
function addDirect(btn, i) {
    selectPointer(directBlock, i);
    $(`#add-${directBlock}-${i}`).addClass('d-none');
    $(`#remove-${directBlock}-${i}`).removeClass('d-none');
}

$(document).ready(() => {
    $(".toast").toast("show");
    readyGame();
    
    // Add click event to grid blocks
    gridContainer.on('click', '.block', function() {
        if (selectedPointer) {
            let blockIndex = $(this).attr('id').split('-')[1];
            updateBlock(blockIndex, selectedPointer.type);
            selectedPointer = null;  // Reset selected pointer after one use
        }
    });
});

function updateBlock(blockIndex, blockType) {
    blockBoard[blockIndex] = type + blockType + divider;
    drawBoard(blockBoard);
}

///////////// Personal Changes ///////////////

function addIndirect(btn, i) {
    let earliestIndex = getEarliestEmptyBlock(blockBoard);
    blockBoard[earliestIndex] = type + indirectBlock + divider;
    $(`#inode-${indirectBlock}-${i}`).attr('data-index', earliestIndex);
    $(`#add-${indirectBlock}-${i}`).addClass('d-none');
    $(`#remove-${indirectBlock}-${i}`).removeClass('d-none');
    $(`#${indirectBlock}-${i}-form`).removeClass('d-hidden');
    drawBoard(blockBoard);
}

function addDouble(btn, i) {
    let earliestIndex = getEarliestEmptyBlock(blockBoard);
    blockBoard[earliestIndex] = type + doubleBlock + divider;
    $(`#inode-${doubleBlock}-${i}`).attr('data-index', earliestIndex);
    $(`#add-${doubleBlock}-${i}`).addClass('d-none');
    $(`#remove-${doubleBlock}-${i}`).removeClass('d-none');
    $(`#${doubleBlock}-${i}-form`).removeClass('d-hidden');
    drawBoard(blockBoard);
}

function removeDirect(btn, i) {
    let blockIndex = Number($(`#inode-${directBlock}-${i}`).attr("data-index"));
    blockBoard[blockIndex] = type + emptyBlock + divider;
    $(`#add-${directBlock}-${i}`).removeClass('d-none');
    $(`#remove-${directBlock}-${i}`).addClass('d-none');
    drawBoard(blockBoard);
}

function removeIndirect(btn, i) {
    let blockIndex = Number($(`#inode-${indirectBlock}-${i}`).attr("data-index"));
    blockBoard[blockIndex] = type + emptyBlock + divider;
    removeBlocksThatContain(blockBoard, previous + blockIndex + divider);
    $(`#add-${indirectBlock}-${i}`).removeClass('d-none');
    $(`#remove-${indirectBlock}-${i}`).addClass('d-none');
    $(`#${indirectBlock}-${i}-form`).addClass('d-hidden');
    $(`#${indirectBlock}-${i}-input`).val(0);
    drawBoard(blockBoard);
}

function removeDouble(btn, i) {
    let blockIndex = Number($(`#inode-${doubleBlock}-${i}`).attr("data-index"));
    let indexesToRemove = getAllChildIndexes(blockBoard, blockIndex);
    for (let i = 0; i < indexesToRemove.length; i++) {
        blockBoard[indexesToRemove[i]] = type + emptyBlock + divider;
    }
    blockBoard[blockIndex] = type + emptyBlock + divider;
    $(`#add-${doubleBlock}-${i}`).removeClass('d-none');
    $(`#remove-${doubleBlock}-${i}`).addClass('d-none');
    $(`#${doubleBlock}-${i}-form`).addClass('d-hidden');
    $(`#${doubleBlock}-${i}-input`).val(0);
    drawBoard(blockBoard);
}

function generateAddressInput(blockType, i, onChangeCallback) {
    const rowDiv = $('<div></div>').attr('id', `${blockType}-${i}-form`).addClass('row g-3 align-items-center d-hidden');
    const colAutoLabelDiv = $('<div></div>').addClass('col-auto mt-1');
    const label = $('<label></label>').addClass('col-form-label').text('Number of addresses');
    const colAutoInputDiv = $('<div></div>').addClass('col-auto mt-1');
    const input = $('<input>').attr('id', `${blockType}-${i}-input`).attr('type', 'number').addClass('form-control form-control-sm').attr('step', '1').attr('data-block', blockType).attr('value', 0);

    // Add the change event listener
    input.on('input', function () {
        onChangeCallback($(this).val(), Number($(`#inode-${blockType}-${i}`).attr("data-index")));
    });

    colAutoLabelDiv.append(label);
    colAutoInputDiv.append(input);
    rowDiv.append(colAutoLabelDiv);
    rowDiv.append(colAutoInputDiv);

    return rowDiv;
}

function handleIndirectAddressChange(value, parentIndex) {
    let numOfAddresses = Number(value);
    let maxAddresses = getNumberOfEmptyBlocks(blockBoard);
    if (numOfAddresses < maxAddresses && 
        numOfAddresses >= 0 && 
        parentIndex < blockBoard.length && 
        parentIndex >= 0
    ) {
        removeBlocksThatContain(blockBoard, previous + parentIndex + divider);
        for (let i = 0; i < numOfAddresses; i++) {
            let earliestIndex = getEarliestEmptyBlock(blockBoard);
            blockBoard[earliestIndex] = type + directBlock + divider + previous + parentIndex + divider;
        }
    }
    drawBoard(blockBoard);
}

function handleDoubleddressChange(value, parentIndex) {
    let numOfAddresses = Number(value);
    let maxAddresses = getNumberOfEmptyBlocks(blockBoard);
    if (numOfAddresses <= maxAddresses && 
        numOfAddresses >= 0 && 
        parentIndex < blockBoard.length && 
        parentIndex >= 0
    ) {
        let indexesToRemove = getAllChildIndexes(blockBoard, parentIndex);
        for (let i = 0; i < indexesToRemove.length; i++) {
            blockBoard[indexesToRemove[i]] = type + emptyBlock + divider;
        }
        for (let i = 0; i < numOfAddresses;) {
            let indirectIndex = getEarliestEmptyBlock(blockBoard);
            blockBoard[indirectIndex] = type + indirectBlock + divider + previous + parentIndex + divider;
            for (let j = 0; j < numOfAddressesPerBlock && i < numOfAddresses; j++) {
                let earliestIndex = getEarliestEmptyBlock(blockBoard);
                blockBoard[earliestIndex] = type + directBlock + divider + previous + indirectIndex + divider;  
                i++;     
            }
        }
    }
    drawBoard(blockBoard);
}

function drawBoard(blocks) {
    
    gridContainer.empty();
    for (let i = 0; i < blocks.length; i++) {
        const block = $('<div></div>').attr('id', 'block-' + i).addClass('block').css('position', 'relative'); // To position the label inside the block
        const label = $('<span></span>').addClass('block-label').text(i);

        if (getType(blocks[i]) != emptyBlock) {
            selectBlock(block, blocks[i]);
        }

        block.append(label);
        gridContainer.append(block);
    }
}

function selectBlock(block, blockType) {
    const type = getType(blockType);
    if (type.includes(directBlock)) {
        drawSelectedBlock(block, directClass);
    } else if (type.includes(indirectBlock)) {
        drawSelectedBlock(block, indirectClass);
    } else if (type.includes(doubleBlock)) {
        drawSelectedBlock(block, doubleClass);  
    }
}

function drawSelectedBlock($block, type) {
    $block.toggleClass(`bg-${type} p-2 text-white bg-opacity-75`);
}

function getAllChildIndexes(blocks, parentIndex) {
    let childIndexes = [];
    function isCorrectParent(index) {
        if (index == parentIndex) {
            return true;
        } else {
            if (blocks[index].includes(previous)) {
                return isCorrectParent(getPreviousIndex(blocks[index]));
            } else {
                return false;
            }
        }
    }

    for (let i = 0; i < blocks.length; i++) {
        if (i != parentIndex) {
            if (isCorrectParent(i)) { 
                childIndexes.push(i);
            }
        }
    }

    return childIndexes;
}

function removeBlocksThatContain(blocks, str) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].includes(str)) {
            blocks[i] = type + emptyBlock + divider;
        }
    }
}

function getEarliestEmptyBlock(blocks) {
    for (let i = 0; i < blocks.length; i++) {
        if (getType(blocks[i]).includes(emptyBlock)) {
            return i;
        }
    }
}

function getNumberOfEmptyBlocks(blocks) {
    let count = 0;
    for (let i = 0; i < blocks.length; i++) {
        if (getType(blocks[i]).includes(emptyBlock)) {
            count++;
        }
    }
    return count;
}

function getType(block) {
    return block.substring(
        block.indexOf(type) + 1, 
        block.lastIndexOf(divider)
    );
}

function getPreviousIndex(block) {
    return Number(block.substring(
        block.indexOf(previous) + 2, 
        block.lastIndexOf(divider)
    ));
}

function getNextIndex(block) {
    return Number(block.substring(
        block.indexOf(next) + 2, 
        block.lastIndexOf(divider)
    ));
}


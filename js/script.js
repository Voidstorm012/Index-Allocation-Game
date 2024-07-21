document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const board = document.getElementById('board');
    const actionButton = document.getElementById('action-button');
    const dataButton = document.getElementById('data-button');
    const hintButton = document.getElementById('hint-button');
    const restartButton = document.getElementById('restart-button');
    const instructionText = document.getElementById('instruction-text');
    const allocationTable = document.getElementById('allocationTable');
    let allocationTableBody = null;

    if (allocationTable) {
        allocationTableBody = allocationTable.getElementsByTagName('tbody')[0];
    }

    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
    const mode = params.get('mode');
    let activateClick = false;
    let dataActivated = false;
    let hintsVisible = false;
    let currentStep = 0;
    let excludeBlocks = new Set();
    let fileCount = 1;
    let dataBoxes = []; // Define dataBoxes at the top level
    let indexBox = null; // Define indexBox at the top level
    let directIndexBoxes = [];

    if (result) {
        console.log('Handling result page:', result, mode);
        handleResultPage(result, mode);
    } else {
        initializeGame();
    }

    function generateUniqueNumbers(count, max, exclude = new Set()) {
        console.log('Generating unique numbers:', count, max, exclude);
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * max) + 1;
            if (!exclude.has(randomNumber)) {
                numbers.add(randomNumber);
                exclude.add(randomNumber);
            }
        }
        return Array.from(numbers);
    }

    function resetGame() {
        console.log('Resetting game');
        window.location.reload();
    }

    function initializeGame() {
        console.log('Initializing game');
        board.innerHTML = '';
        actionButton.disabled = false;
        dataButton.disabled = true;
        activateClick = false;
        dataActivated = false;
        currentStep = 0;
        excludeBlocks.clear();
        if (allocationTableBody) {
            allocationTableBody.innerHTML = '';
        }
        dataBoxes = []; // Clear dataBoxes
        indexBox = null; // Clear indexBox
        directIndexBoxes = [];

        // Initialize 8x8 board
        for (let i = 0; i < 64; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;
            board.appendChild(box);
        }

        if (mode === 'easy') {
            startEasyMode();
        } else if (mode === 'medium') {
            startMediumMode();
        } else if (mode === 'hard') {
            startHardMode();
        }
    }

    function removeEventListeners() {
        console.log('Removing event listeners');
        const boxes = Array.from(board.getElementsByClassName('box'));
        boxes.forEach(box => {
            const newBox = box.cloneNode(true);
            box.parentNode.replaceChild(newBox, box);
        });
    }

    function startEasyMode() {
        console.log('Starting easy mode');
        instructionText.textContent = 'Select the index block by clicking the "Index" button, followed by the index block number.';

        removeEventListeners();

        const [indexNumber, ...dataNumbersArray] = generateUniqueNumbers(7, 64, excludeBlocks);
        console.log('Easy mode - Index number:', indexNumber, 'Data numbers:', dataNumbersArray);
        excludeBlocks.add(indexNumber);
        dataNumbersArray.forEach(num => excludeBlocks.add(num));

        if (allocationTableBody) {
            updateTableEasy(indexNumber, dataNumbersArray);
        }

        const boxes = Array.from(board.getElementsByClassName('box'));
        dataBoxes = [];
        let selectedDataBoxes = new Set();

        boxes.forEach(box => {
            const boxNumber = parseInt(box.textContent);
            if (boxNumber === indexNumber) {
                indexBox = box;
                //box.classList.add('glow-blue'); // Highlight the index block
            } else if (dataNumbersArray.includes(boxNumber)) {
                dataBoxes.push(box);
                //box.classList.add('glow-green'); // Highlight the data blocks
            }

            box.addEventListener('click', () => {
                if (activateClick) {
                    if (box === indexBox) {
                        box.classList.add('blue');
                        actionButton.disabled = true;
                        dataButton.disabled = false;
                        activateClick = false;
                        instructionText.textContent = 'Select the data block by clicking the "Data" button, followed by the data block numbers.';
                    }
                } else if (dataActivated && dataNumbersArray.includes(boxNumber)) {
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkEasyWinCondition(dataBoxes);
                } else if (box !== indexBox && !dataNumbersArray.includes(boxNumber)) {
                    alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                    resetGame();
                }
            });
        });

        function checkEasyWinCondition(dataBoxes) {
            console.log('Checking easy win condition');
            if (selectedDataBoxes.size === dataBoxes.length) {
                if (mode === 'hard') {
                    currentStep++;
                    instructionText.textContent = 'Proceeding to the medium mode steps...';
                    actionButton.disabled = false; // Enable the action button for the next mode
                    dataButton.disabled = true;
                    toggleHints();
                    startMediumMode();
                } else {
                    window.location.href = '../result.html?result=win&mode=easy';
                }
            }
        }

        actionButton.addEventListener('click', () => {
            console.log('Action button clicked');
            activateClick = true;
        });

        dataButton.addEventListener('click', () => {
            console.log('Data button clicked');
            dataActivated = true;
        });
    }

    function startMediumMode() {
        console.log('Starting medium mode');
        instructionText.textContent = 'Select the first-level index block by clicking the "Index" button, followed by the first index block number.';

        removeEventListeners();

        const [indexNumber, ...secondaryIndexNumbers] = generateUniqueNumbers(4, 64, excludeBlocks);
        console.log('Medium mode - Index number:', indexNumber, 'Secondary index numbers:', secondaryIndexNumbers);
        excludeBlocks.add(indexNumber);
        secondaryIndexNumbers.forEach(num => excludeBlocks.add(num));
        const dataNumbersArray = generateUniqueNumbers(12, 64, excludeBlocks);
        console.log('Medium mode - Data numbers:', dataNumbersArray);
        dataNumbersArray.forEach(num => excludeBlocks.add(num));

        indexDataMapping = {
            [indexNumber]: secondaryIndexNumbers,
            ...Object.fromEntries(secondaryIndexNumbers.map((secIndex, i) => [secIndex, dataNumbersArray.slice(i * 4, i * 4 + 4)]))
        };

        if (allocationTableBody) {
            updateTableMedium(indexNumber, indexDataMapping);
        }

        const boxes = Array.from(board.getElementsByClassName('box'));
        directIndexBoxes = [];
        let selectedDirectIndexes = new Set();
        dataBoxes = [];
        let selectedDataBoxes = new Set();

        boxes.forEach(box => {
            const boxNumber = parseInt(box.textContent);
            if (boxNumber === indexNumber) {
                indexBox = box;
                //box.classList.add('glow-blue'); // Highlight the index block
            } else if (secondaryIndexNumbers.includes(boxNumber)) {
                directIndexBoxes.push(box);
                //box.classList.add('glow-blue'); // Highlight the secondary index blocks
            } else if (dataNumbersArray.includes(boxNumber)) {
                dataBoxes.push(box);
                //box.classList.add('glow-green'); // Highlight the data blocks
            }

            box.addEventListener('click', () => {
                console.log('Box clicked:', boxNumber);
                if (activateClick) {
                    if (box === indexBox) {
                        box.classList.add('blue');
                        actionButton.disabled = false;
                        instructionText.textContent = 'Now select the second-level index block numbers.';
                    } else if (directIndexBoxes.includes(box)) {
                        box.classList.add('orange');
                        selectedDirectIndexes.add(box);
                        if (selectedDirectIndexes.size === directIndexBoxes.length) {
                            actionButton.disabled = true;
                            dataButton.disabled = false;
                            instructionText.textContent = 'Select the data block by clicking the "Data" button, followed by the data block numbers.';
                        }
                    } else if (dataActivated && dataNumbersArray.includes(boxNumber)) {
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkMediumWinCondition(dataBoxes);
                    } else if (!activateClick && box !== indexBox) {
                        alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                        resetGame();
                    } else if (dataActivated && !dataNumbersArray.includes(boxNumber)) {
                        alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                        resetGame();
                    }
                } else if (dataActivated && dataNumbersArray.includes(boxNumber)) {
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkMediumWinCondition(dataBoxes);
                } else if (dataActivated && !dataNumbersArray.includes(boxNumber)) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
        });

        function checkMediumWinCondition(dataBoxes) {
            console.log('Checking medium win condition');
            console.log('selectedDataBoxes.size:', selectedDataBoxes.size);
            console.log('dataBoxes.length:', dataBoxes.length);
            if (selectedDataBoxes.size === dataBoxes.length) {
                if (mode === 'hard') {
                    if (fileCount === 1) { // Check if it's the first file
                        fileCount++; // Increment the file count
                        instructionText.textContent = 'Proceeding to the next file steps...';
                        toggleHints();
                        startNextFileInHardMode();
                    } else {
                        window.location.href = '../result.html?result=win&mode=hard';
                    }
                } else if (mode == 'medium') {
                    window.location.href = '../result.html?result=win&mode=medium';
                }
            }
        }

        actionButton.addEventListener('click', () => {
            console.log('Action button clicked');
            activateClick = true;
        });

        dataButton.addEventListener('click', () => {
            console.log('Data button clicked');
            dataActivated = true;
        });
    }

    function startDirectMode() {
        console.log('Starting direct mode');
        instructionText.textContent = 'Select the data block by clicking the "Data" button, followed by the direct data blocks.';

        removeEventListeners();

        const [dataBlock] = generateUniqueNumbers(1, 64, excludeBlocks);
        console.log('Direct mode - Data block:', dataBlock);
        excludeBlocks.add(dataBlock);

        if (allocationTableBody) {
            updateTableDirect(dataBlock);
        }

        const boxes = Array.from(board.getElementsByClassName('box'));
        let selectedDataBlock = null;
        dataBoxes = [];

        boxes.forEach(box => {
            const boxNumber = parseInt(box.textContent);
            if (boxNumber === dataBlock) {
                dataBoxes.push(box);
                //box.classList.add('glow-green'); // Highlight the data block
            }

            box.addEventListener('click', () => {
                console.log('Box clicked:', boxNumber);
                if (dataActivated && boxNumber === dataBlock) {
                    box.classList.add('green');
                    selectedDataBlock = box;
                    checkDirectWinCondition();
                } else if (dataActivated && boxNumber !== dataBlock) {
                    alert('Wrong block clicked! Restarting the game.');
                    resetGame();
                }
            });
        });

        function checkDirectWinCondition() {
            console.log('Checking direct win condition');
            if (selectedDataBlock) {
                if (mode === 'hard') {
                    currentStep++;
                    if (currentStep < 3) { // Run direct mode 3 times
                        instructionText.textContent = `Direct Mode Step ${currentStep + 1}`;
                        activateClick = false;
                        dataActivated = true;
                        toggleHints();
                        startDirectMode();
                    } else {
                        instructionText.textContent = 'Proceeding to the easy mode step...';
                        actionButton.disabled = false; // Enable the action button for the next mode
                        dataButton.disabled = true;
                        toggleHints();
                        startEasyMode();
                    }
                } else {
                    window.location.href = '../result.html?result=win&mode=direct';
                }
            }
        }

        actionButton.disabled = true;
        dataButton.disabled = false;

        dataButton.addEventListener('click', () => {
            console.log('Data button clicked');
            dataActivated = true;
        });
    }

    function startHardMode() {
        console.log('Starting hard mode');
        currentStep = 0;
        fileCount = 1;
        
        hardSequence();
    }

    function hardSequence() {
        console.log('Running hard sequence, currentStep:', currentStep);
        if (currentStep < 3) {
            startDirectMode();
        } else if (currentStep === 3) {
            startEasyMode();
        } else if (currentStep === 4) {
            startMediumMode();
        }
    }

    function startNextFileInHardMode() {
        console.log('Starting next file in hard mode');
        if (currentStep === 4) {
            if (allocationTableBody) {
                allocationTableBody.innerHTML = ''; // Clear the table
            }
            currentStep = 0;
            instructionText.textContent = 'Proceeding to the second file...';
            setTimeout(() => {
                allocationTableTitle.textContent = '(File 02)';
                hardSequence();
            }, 2000); // Wait for 2 seconds before starting the next file
        }
    }

    function updateTableEasy(indexBlock, dataBlocks) {
        if (!allocationTableBody) return;
        console.log('Updating table for easy mode', indexBlock, dataBlocks);
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        const dataCell = document.createElement('td');

        indexCell.innerText = `${indexBlock}`;
        dataCell.innerText = `${dataBlocks.join(', ')}`;

        row.appendChild(indexCell);
        row.appendChild(dataCell);
        allocationTableBody.appendChild(row);
    }

    
    function updateTableMedium(initialIndex, indexDataMapping) {
        if (!allocationTableBody) return;
        console.log('Updating table for medium mode', initialIndex, indexDataMapping);
        const initialRow = document.createElement('tr');
        const initialIndexCell = document.createElement('td');
        initialIndexCell.colSpan = 2;
        initialIndexCell.innerText = `Initial Index: ${initialIndex}`;
        initialRow.appendChild(initialIndexCell);
        allocationTableBody.appendChild(initialRow);

        Object.entries(indexDataMapping).forEach(([indexBlock, dataBlocks]) => {
            const row = document.createElement('tr');
            const indexCell = document.createElement('td');
            const dataCell = document.createElement('td');

            indexCell.innerText = `${indexBlock}`;
            dataCell.innerText = dataBlocks.join(', ');

            row.appendChild(indexCell);
            row.appendChild(dataCell);
            allocationTableBody.appendChild(row);
        });
    }

    function updateTableDirect(dataBlock) {
        if (!allocationTableBody) return;
        console.log('Updating table for direct mode', dataBlock);
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        const dataCell = document.createElement('td');

        indexCell.innerText = '';
        dataCell.innerText = `Direct Data Block: ${dataBlock}`;

        row.appendChild(indexCell);
        row.appendChild(dataCell);
        allocationTableBody.appendChild(row);
    }

    function handleResultPage(result, mode) {
        console.log('Handling result page', result, mode);
        const titleElement = document.getElementById('result-title');
        const descriptionElement = document.getElementById('result-description');
        titleElement.textContent = result === 'win' ? 'Congratulations!' : 'Game Over';
        descriptionElement.textContent = result === 'win'
            ? `You have completed the game!`
            : 'You have lost the game. Try again!';
        if (result === 'win') {
            triggerConfetti();
        }
    }

    function triggerConfetti() {
        console.log('Triggering confetti');
        var end = Date.now() + (5 * 1000);

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    function toggleHints() {
        console.log('Toggling hints');
        const boxes = Array.from(board.getElementsByClassName('box'));
        hintsVisible = !hintsVisible;
        boxes.forEach(box => {
            const boxNumber = parseInt(box.textContent);
            if (box.classList.contains('blue') || box.classList.contains('green') || box.classList.contains('orange')) {
                box.classList.remove('glow-blue', 'glow-green', 'glow-orange');
            } else {
                if (hintsVisible) {
                    console.log('Showing glow classes');
                    if (box === indexBox) {
                        box.classList.add('glow-blue');
                    } else if (dataBoxes.includes(box)) {
                        box.classList.add('glow-green');
                    } else if (directIndexBoxes.includes(box)) {
                        box.classList.add('glow-orange');
                    }
                } else if (!hintsVisible) {
                    console.log('Removing glow classes');
                    box.classList.remove('glow-blue', 'glow-green', 'glow-orange');
                }
            }
        });
    }

    restartButton.addEventListener('click', resetGame);

    hintButton.addEventListener('click', toggleHints);

    initializeGame();
});

function restartGame() {
    console.log('Restarting game');
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    window.location.href = `difficulty/${mode}Difficulty.html`;
}

function backToMainMenu() {
    console.log('Going back to main menu');
    window.location.href = 'index.html';
}

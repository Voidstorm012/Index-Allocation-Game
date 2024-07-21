document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const actionButton = document.getElementById('action-button');
    const dataButton = document.getElementById('data-button');
    const hintButton = document.getElementById('hint-button');
    const restartButton = document.getElementById('restart-button');
    const instructionText = document.getElementById('instruction-text');
    const allocationTableBody = document.getElementById('allocationTable').getElementsByTagName('tbody')[0];
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
    const mode = params.get('mode');
    const titleElement = document.getElementById('result-title');
    const descriptionElement = document.getElementById('result-description');
    let activateClick = false;
    let indexHighlighted = false;
    let dataActivated = false;
    let indexBox;
    let indexBox2;
    let directIndexBoxes = [];
    let indirectIndexBoxes = [];
    let dataBoxes = [];
    let dataBoxes2 = [];
    let selectedDirectIndexes = new Set();
    let selectedIndirectIndexes = new Set();
    let selectedDataBoxes = new Set();
    let currentFile = 1;
    let hintActive = false;
    let currentStep = 0;

    if (result) {
        handleResultPage(result, mode);
    } else {
        initializeGame();
    }

    function generateUniqueNumbers(count, max, exclude = []) {
        const numbers = new Set(exclude);
        while (numbers.size < count + exclude.length) {
            const randomNumber = Math.floor(Math.random() * max) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).filter(num => !exclude.includes(num));
    }

    function resetGame() {
        initializeGame();
    }

    function initializeGame() {
        board.innerHTML = '';
        actionButton.disabled = false;
        dataButton.disabled = true;
        selectedDirectIndexes.clear();
        selectedIndirectIndexes.clear();
        selectedDataBoxes.clear();
        activateClick = false;
        indexHighlighted = false;
        dataActivated = false;
        directIndexBoxes = [];
        indirectIndexBoxes = [];
        dataBoxes = [];
        dataBoxes2 = [];
        currentFile = 1;
        currentStep = 0;
        allocationTableBody.innerHTML = '';

        if (mode === 'easy') {
            startEasyMode();
        } else if (mode === 'medium') {
            startMediumMode();
        } else if (mode === 'hard') {
            startHardMode();
        }
    }

    function startEasyMode() {
        instructionText.textContent = 'Select the index block by clicking the "Index" button, followed by the index block number.';

        const [indexNumber, ...dataNumbers] = generateUniqueNumbers(7, 144);
        const dataNumbersArray = [...dataNumbers];

        // Update table with generated hints
        updateTableEasy(indexNumber, dataNumbersArray);

        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber) {
                indexBox = box;
            } else if (dataNumbersArray.includes(parseInt(box.textContent))) {
                dataBoxes.push(box);
            }

            box.addEventListener('click', () => {
                if (activateClick) {
                    if (box === indexBox) {
                        box.classList.add('blue');
                        indexHighlighted = false;
                        dataButton.disabled = false;
                        activateClick = false;
                        instructionText.textContent = 'Select the data blocks by clicking the "Data" button, followed by the data block numbers.';
                        updateTableEasy(indexNumber, dataNumbersArray);
                    } else if (dataActivated && dataNumbersArray.includes(parseInt(box.textContent))) {
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition(dataBoxes);
                    } else if (box !== indexBox && !dataNumbersArray.includes(parseInt(box.textContent))) {
                        alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                        resetGame();
                    }
                } else if (dataActivated && dataNumbersArray.includes(parseInt(box.textContent))) {
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkWinCondition(dataBoxes);
                } else if (dataActivated && !dataNumbersArray.includes(parseInt(box.textContent))) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
        }

        function checkWinCondition(dataBoxes) {
            if (selectedDataBoxes.size === dataBoxes.length) {
                window.location.href = `../result.html?result=win&mode=${mode}`;
            }
        }

        actionButton.addEventListener('click', () => {
            activateClick = true;
        });

        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });

        hintButton.addEventListener('click', () => {
            hintActive = !hintActive;
            toggleHints(indexBox, dataBoxes);
        });
    }

    function startMediumMode() {
        instructionText.textContent = 'Select the first-level index block by clicking the "Index" button, followed by the index block number.';

        const [indexNumber, ...secondaryIndexNumbers] = generateUniqueNumbers(4, 144);
        const dataNumbersArray = generateUniqueNumbers(9, 144, [indexNumber, ...secondaryIndexNumbers]);

        const indexDataMapping = {
            [indexNumber]: secondaryIndexNumbers,
            ...Object.fromEntries(secondaryIndexNumbers.map((secIndex, i) => [secIndex, dataNumbersArray.slice(i * 3, i * 3 + 3)]))
        };

        // Update table with generated hints
        updateTableMedium(indexDataMapping);

        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber) {
                indexBox = box;
            } else if (secondaryIndexNumbers.includes(parseInt(box.textContent))) {
                directIndexBoxes.push(box);
            } else if (dataNumbersArray.includes(parseInt(box.textContent))) {
                dataBoxes.push(box);
            }

            box.addEventListener('click', () => {
                if (activateClick) {
                    if (box === indexBox) {
                        box.classList.add('blue');
                        indexHighlighted = false;
                        highlightDirectIndexBlocks(directIndexBoxes);
                        actionButton.disabled = true;
                        instructionText.textContent = 'Now select the second-level index block by clicking the index block numbers.';
                    } else if (directIndexBoxes.includes(box)) {
                        box.classList.add('blue');
                        selectedDirectIndexes.add(box);
                        if (selectedDirectIndexes.size === directIndexBoxes.length) {
                            highlightDataBlocks(dataBoxes, 'green');
                            dataButton.disabled = false;
                            instructionText.textContent = 'Select the data blocks by clicking the "Data" button, followed by the data block numbers.';
                        }
                    } else if (dataActivated && dataNumbersArray.includes(parseInt(box.textContent))) {
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition(dataBoxes);
                    } else if (!indexHighlighted && box !== indexBox) {
                        alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                        resetGame();
                    } else if (dataActivated && !dataNumbersArray.includes(parseInt(box.textContent))) {
                        alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                        resetGame();
                    }
                } else if (dataActivated && dataNumbersArray.includes(parseInt(box.textContent))) {
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkWinCondition(dataBoxes);
                } else if (dataActivated && !dataNumbersArray.includes(parseInt(box.textContent))) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
        }

        function highlightDirectIndexBlocks(directIndexBoxes) {
            directIndexBoxes.forEach(box => {
                box.classList.add('glow-blue');
            });
        }

        function highlightDataBlocks(dataBoxes, color) {
            dataBoxes.forEach(box => {
                box.classList.add(`glow-${color}`);
            });
        }

        function checkWinCondition(dataBoxes) {
            if (selectedDataBoxes.size === dataBoxes.length) {
                window.location.href = `../result.html?result=win&mode=${mode}`;
            }
        }

        actionButton.addEventListener('click', () => {
            activateClick = true;
        });

        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });

        hintButton.addEventListener('click', () => {
            hintActive = !hintActive;
            toggleHints(indexBox, dataBoxes);
        });
    }

    function startHardMode() {
        instructionText.textContent = 'Select the first direct index block by clicking the "Index" button, followed by the index block number.';

        // Generate unique blocks for the first file
        const indexNumber1 = generateUniqueNumbers(1, 144)[0];
        const directIndexNumbers1 = generateUniqueNumbers(3, 144, [indexNumber1]);
        const indirectIndexNumbers1 = generateUniqueNumbers(2, 144, [indexNumber1, ...directIndexNumbers1]);
        const dataNumbersArray1 = generateUniqueNumbers(40, 144, [indexNumber1, ...directIndexNumbers1, ...indirectIndexNumbers1]);

        // Generate unique blocks for the second file ensuring no overlap with the first file
        const excludeBlocks = [indexNumber1, ...directIndexNumbers1, ...indirectIndexNumbers1, ...dataNumbersArray1];
        const indexNumber2 = generateUniqueNumbers(1, 144, excludeBlocks)[0];
        const directIndexNumbers2 = generateUniqueNumbers(3, 144, [indexNumber2, ...excludeBlocks]);
        const indirectIndexNumbers2 = generateUniqueNumbers(2, 144, [indexNumber2, ...directIndexNumbers2, ...excludeBlocks]);
        const dataNumbersArray2 = generateUniqueNumbers(40, 144, [indexNumber2, ...directIndexNumbers2, ...indirectIndexNumbers2, ...excludeBlocks]);

        // Create index to data mapping
        const indexDataMapping1 = {
            [indexNumber1]: [...directIndexNumbers1, ...indirectIndexNumbers1],
            ...Object.fromEntries(directIndexNumbers1.map((idx, i) => [idx, dataNumbersArray1.slice(i * 3, i * 3 + 3)])),
            ...Object.fromEntries(indirectIndexNumbers1.map((idx, i) => [idx, dataNumbersArray1.slice((directIndexNumbers1.length + i) * 3, (directIndexNumbers1.length + i) * 3 + 3)]))
        };

        const indexDataMapping2 = {
            [indexNumber2]: [...directIndexNumbers2, ...indirectIndexNumbers2],
            ...Object.fromEntries(directIndexNumbers2.map((idx, i) => [idx, dataNumbersArray2.slice(i * 3, i * 3 + 3)])),
            ...Object.fromEntries(indirectIndexNumbers2.map((idx, i) => [idx, dataNumbersArray2.slice((directIndexNumbers2.length + i) * 3, (directIndexNumbers2.length + i) * 3 + 3)]))
        };

        updateTableHard(indexNumber1, indexDataMapping1, true);

        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber1) {
                indexBox = box;
            } else if (parseInt(box.textContent) === indexNumber2) {
                indexBox2 = box;
            } else if (directIndexNumbers1.includes(parseInt(box.textContent))) {
                box.classList.add('direct1');
                directIndexBoxes.push(box);
            } else if (indirectIndexNumbers1.includes(parseInt(box.textContent))) {
                box.classList.add('indirect1');
                indirectIndexBoxes.push(box);
            } else if (directIndexNumbers2.includes(parseInt(box.textContent))) {
                box.classList.add('direct2');
                directIndexBoxes.push(box);
            } else if (indirectIndexNumbers2.includes(parseInt(box.textContent))) {
                box.classList.add('indirect2');
                indirectIndexBoxes.push(box);
            } else if (dataNumbersArray1.includes(parseInt(box.textContent))) {
                box.classList.add('data1');
                dataBoxes.push(box);
            } else if (dataNumbersArray2.includes(parseInt(box.textContent))) {
                box.classList.add('data2');
                dataBoxes2.push(box);
            }

            box.addEventListener('click', () => {
                if (activateClick) {
                    if (currentFile === 1) {
                        handleFile1Click(box, indexNumber1, indexDataMapping1, indexBox);
                    } else if (currentFile === 2) {
                        handleFile2Click(box, indexNumber2, indexDataMapping2, indexBox2);
                    }
                }
            });
            board.appendChild(box);
        }

        function handleFile1Click(box, indexNumber, indexDataMapping, indexBox) {
            if (box === indexBox) {
                box.classList.add('blue');
                indexHighlighted = false;
                currentStep++;
                highlightDirectIndexBlocks1();
                actionButton.disabled = true;
                instructionText.textContent = 'Now select the first direct index block for file 1.';
            } else if (directIndexNumbers1.includes(parseInt(box.textContent))) {
                handleDirectIndexClick(box, indexDataMapping, dataNumbersArray1, 'file 1');
            } else if (indirectIndexNumbers1.includes(parseInt(box.textContent))) {
                handleIndirectIndexClick(box, indexDataMapping, dataNumbersArray1, 'file 1');
            } else if (dataActivated && dataNumbersArray1.includes(parseInt(box.textContent))) {
                box.classList.add('green');
                selectedDataBoxes.add(box);
                checkWinCondition1();
            } else if (!indexHighlighted && box !== indexBox) {
                alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                resetGame();
            } else if (dataActivated && !dataNumbersArray1.includes(parseInt(box.textContent))) {
                alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                resetGame();
            }
        }

        function handleFile2Click(box, indexNumber, indexDataMapping, indexBox) {
            if (box === indexBox) {
                box.classList.add('light-blue');
                indexHighlighted = false;
                currentStep++;
                highlightDirectIndexBlocks2();
                actionButton.disabled = true;
                instructionText.textContent = 'Now select the first direct index block for file 2.';
            } else if (directIndexNumbers2.includes(parseInt(box.textContent))) {
                handleDirectIndexClick(box, indexDataMapping, dataNumbersArray2, 'file 2');
            } else if (indirectIndexNumbers2.includes(parseInt(box.textContent))) {
                handleIndirectIndexClick(box, indexDataMapping, dataNumbersArray2, 'file 2');
            } else if (dataActivated && dataNumbersArray2.includes(parseInt(box.textContent))) {
                box.classList.add('light-green');
                selectedDataBoxes.add(box);
                checkWinCondition2();
            } else if (!indexHighlighted && box !== indexBox) {
                alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                resetGame();
            } else if (dataActivated && !dataNumbersArray2.includes(parseInt(box.textContent))) {
                alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                resetGame();
            }
        }

        function handleDirectIndexClick(box, indexDataMapping, dataNumbersArray, file) {
            box.classList.add('orange');
            selectedDirectIndexes.add(box);
            dataButton.disabled = false;
            highlightDataBlocks(indexDataMapping[parseInt(box.textContent)], 'green');
            instructionText.textContent = `Select the data blocks for the direct index block for ${file}.`;
        }

        function handleIndirectIndexClick(box, indexDataMapping, dataNumbersArray, file) {
            box.classList.add('orange');
            selectedIndirectIndexes.add(box);
            dataButton.disabled = false;
            highlightIndirectDataBlocks(indexDataMapping[parseInt(box.textContent)], 'green');
            instructionText.textContent = `Select the data blocks for the indirect index block for ${file}.`;
        }

        function highlightDirectIndexBlocks1() {
            directIndexNumbers1.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-orange');
                }
            });
        }

        function highlightDirectIndexBlocks2() {
            directIndexNumbers2.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-light-orange');
                }
            });
        }

        function highlightIndirectIndexBlocks1() {
            indirectIndexNumbers1.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-orange');
                }
            });
        }

        function highlightIndirectIndexBlocks2() {
            indirectIndexNumbers2.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-light-orange');
                }
            });
        }

        function highlightDataBlocks(dataBoxes, color) {
            dataBoxes.forEach(box => {
                const dataBox = board.querySelector(`.box:nth-child(${box})`);
                if (dataBox) {
                    dataBox.classList.add(`glow-${color}`);
                }
            });
        }

        function highlightIndirectDataBlocks(dataBoxes, color) {
            dataBoxes.forEach(box => {
                const dataBox = board.querySelector(`.box:nth-child(${box})`);
                if (dataBox) {
                    dataBox.classList.add(`glow-${color}`);
                }
            });
        }

        function checkWinCondition1() {
            if (selectedDataBoxes.size === dataBoxes.length) {
                alert('Congratulations! You have completed the first file!');
                currentFile = 2;
                actionButton.disabled = false;
                dataButton.disabled = true;
                activateClick = false;
                dataActivated = false;
                selectedDirectIndexes.clear();
                selectedIndirectIndexes.clear();
                selectedDataBoxes.clear();
                indexHighlighted = false;
                currentStep = 0;
                updateTableHard(indexNumber2, indexDataMapping2, true);
                indexBox2.classList.add('glow-light-blue');
                instructionText.textContent = 'Select the second index block by clicking the "Index" button, followed by the index block number.';
            }
        }

        function checkWinCondition2() {
            if (selectedDataBoxes.size === dataBoxes2.length) {
                window.location.href = `../result.html?result=win&mode=${mode}`;
            }
        }

        actionButton.addEventListener('click', () => {
            activateClick = true;
        });

        dataButton.addEventListener('click', () => {
            dataActivated = true;
            actionButton.disabled = false; // Enable the "Index" button
        });

        hintButton.addEventListener('click', () => {
            hintActive = !hintActive;
            if (currentFile === 1) {
                toggleHints(indexBox, dataBoxes);
            } else if (currentFile === 2) {
                toggleHints(indexBox2, dataBoxes2);
            }
        });
    }

    function updateTableEasy(indexBlock, dataBlocks) {
        allocationTableBody.innerHTML = ''; // Clear the table before updating
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        const dataCell = document.createElement('td');

        indexCell.innerText = indexBlock;
        dataCell.innerText = dataBlocks.join(', ');

        row.appendChild(indexCell);
        row.appendChild(dataCell);
        allocationTableBody.appendChild(row);
    }

    function updateTableMedium(indexDataMapping) {
        allocationTableBody.innerHTML = ''; // Clear the table before updating
        Object.entries(indexDataMapping).forEach(([indexBlock, dataBlocks]) => {
            const row = document.createElement('tr');
            const indexCell = document.createElement('td');
            const dataCell = document.createElement('td');

            indexCell.innerText = indexBlock;
            dataCell.innerText = dataBlocks.join(', ');

            row.appendChild(indexCell);
            row.appendChild(dataCell);
            allocationTableBody.appendChild(row);
        });
    }

    function updateTableHard(initialIndex, indexDataMapping, reset = false) {
        if (reset) {
            allocationTableBody.innerHTML = ''; // Clear the table before updating
        }
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        const dataCell = document.createElement('td');

        indexCell.innerText = initialIndex;
        dataCell.innerText = indexDataMapping[initialIndex].join(', ');

        row.appendChild(indexCell);
        row.appendChild(dataCell);
        allocationTableBody.appendChild(row);
    }

    function toggleHints(indexBox, dataBoxes) {
        if (hintActive) {
            indexBox.classList.add('glow-blue');
            dataBoxes.forEach(box => {
                box.classList.add('glow-green');
            });
        } else {
            indexBox.classList.remove('glow-blue');
            dataBoxes.forEach(box => {
                box.classList.remove('glow-green');
            });
        }
    }

    function handleResultPage(result, mode) {
        titleElement.textContent = result === 'win' ? 'Congratulations!' : 'Game Over';
        descriptionElement.textContent = result === 'win'
            ? `You have completed the game in ${mode} mode.`
            : 'You have lost the game. Try again!';
        if (result === 'win') {
            triggerConfetti();
        }
    }

    function triggerConfetti() {
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

    restartButton.addEventListener('click', resetGame);

    initializeGame();
});

function restartGame() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    window.location.href = `difficulty/${mode}Difficulty.html`;
}

function backToMainMenu() {
    window.location.href = 'index.html';
}
     
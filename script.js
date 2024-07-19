document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');
    const actionButton = document.getElementById('action-button');
    const dataButton = document.getElementById('data-button');
    const restartButton = document.getElementById('restart-button');
    let activateClick = false;
    let indexHighlighted = false;
    let dataActivated = false;
    let indexBox1;
    let indexBox2;
    let directIndexBoxes = [];
    let indirectIndexBoxes = [];
    let selectedDirectIndexes = new Set();
    let selectedIndirectIndexes = new Set();
    let dataBoxes = [];
    let selectedDataBoxes = new Set();
    let mode = 'easy';
    let currentFile = 1;
    let phase = 'direct'; // 'direct' or 'indirect'

    // Function to generate unique random numbers
    function generateUniqueNumbers(count, max) {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * max) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    }

    // Function to reset the game
    function resetGame() {
        console.log('Game is resetting...');
        window.location.reload(); // Simple way to reset the game
    }

    // Function to initialize the game
    function initializeGame() {
        console.log('Initializing game...');
        board.innerHTML = ''; // Clear the board
        actionButton.disabled = false;
        dataButton.disabled = true;
        selectedDataBoxes.clear();
        selectedDirectIndexes.clear();
        selectedIndirectIndexes.clear();
        activateClick = false;
        indexHighlighted = false;
        dataActivated = false;
        directIndexBoxes = [];
        indirectIndexBoxes = [];
        dataBoxes = [];
        currentFile = 1;
        phase = 'direct';

        if (mode === 'easy') {
            startEasyMode();
        } else if (mode === 'medium') {
            startMediumMode();
        } else if (mode === 'hard') {
            startHardMode();
        }
    }

    // Easy mode setup
    function startEasyMode() {
        console.log('Starting Easy Mode...');
        // Generate random index number and data numbers
        const [indexNumber, ...dataNumbers] = generateUniqueNumbers(7, 144);
        const dataNumbersArray = [...dataNumbers]; // Store data numbers in an array

        console.log("Index Number:", indexNumber);  // For debugging
        console.log("Data Numbers:", dataNumbersArray);  // For debugging

        // Generate the 12x12 board
        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber) {
                indexBox1 = box;
            } else if (dataNumbersArray.includes(parseInt(box.textContent))) {
                dataBoxes.push(box);
            }

            box.addEventListener('click', () => {
                try {
                    if (activateClick) {
                        if (box === indexBox1 && box.classList.contains('glow-blue')) {
                            console.log('Index block selected:', box.textContent);
                            box.classList.remove('glow-blue');
                            box.classList.add('blue');
                            indexHighlighted = false;
                            highlightDataBlocks();
                            actionButton.disabled = true;  // Disable the index button
                            dataButton.disabled = false;   // Enable the data button
                            activateClick = false; // Disable further blue selection
                        } else if (dataActivated && box.classList.contains('glow-green')) {
                            console.log('Data block selected:', box.textContent);
                            box.classList.remove('glow-green');
                            box.classList.add('green');
                            selectedDataBoxes.add(box);
                            checkWinCondition();
                        } else if (box !== indexBox1 && !dataNumbersArray.includes(parseInt(box.textContent))) {
                            console.error('Wrong block clicked:', box.textContent);
                            alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                            resetGame();
                        }
                    } else if (dataActivated && box.classList.contains('glow-green')) {
                        console.log('Data block selected:', box.textContent);
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition();
                    } else if (dataActivated && !box.classList.contains('glow-green')) {
                        console.error('Wrong data block clicked:', box.textContent);
                        alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                        resetGame();
                    }
                } catch (error) {
                    console.error('Error handling block click:', error);
                }
            });
            board.appendChild(box);
        }

        // Function to highlight data blocks
        function highlightDataBlocks() {
            console.log('Highlighting data blocks...');
            dataBoxes.forEach(box => {
                box.classList.add('glow-green');
            });
        }

        // Function to check if the user has selected all the correct data blocks
        function checkWinCondition() {
            if (selectedDataBoxes.size === dataBoxes.length) {
                console.log('All data blocks selected correctly. User wins!');
                alert('Congratulations! You have followed the entire chain and won the game!');
            }
        }

        // Activate button click event
        actionButton.addEventListener('click', () => {
            try {
                activateClick = true;
                if (!indexHighlighted) {
                    indexBox1.classList.add('glow-blue');
                    indexHighlighted = true;
                    console.log('Index button clicked. Index block highlighted.');
                }
            } catch (error) {
                console.error('Error activating index button:', error);
            }
        });

        // Data button click event
        dataButton.addEventListener('click', () => {
            try {
                dataActivated = true;
                console.log('Data button clicked. Data blocks activated.');
            } catch (error) {
                console.error('Error activating data button:', error);
            }
        });
    }

    // Medium mode setup
    function startMediumMode() {
        console.log('Starting Medium Mode...');
        // Generate random index number, secondary index numbers, and data numbers
        const [indexNumber, ...secondaryIndexNumbers] = generateUniqueNumbers(3, 144);
        const dataNumbersArray = generateUniqueNumbers(6, 144).filter(num => !secondaryIndexNumbers.includes(num) && num !== indexNumber);

        console.log("Index Number:", indexNumber);  // For debugging
        console.log("Secondary Index Numbers:", secondaryIndexNumbers);  // For debugging
        console.log("Data Numbers:", dataNumbersArray);  // For debugging

        // Generate the 12x12 board
        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber) {
                indexBox1 = box;
            } else if (secondaryIndexNumbers.includes(parseInt(box.textContent))) {
                directIndexBoxes.push(box);
            } else if (dataNumbersArray.includes(parseInt(box.textContent))) {
                dataBoxes.push(box);
            }

            box.addEventListener('click', () => {
                try {
                    if (activateClick) {
                        if (box === indexBox1 && box.classList.contains('glow-blue')) {
                            console.log('Index block selected:', box.textContent);
                            box.classList.remove('glow-blue');
                            box.classList.add('blue');
                            indexHighlighted = false;
                            highlightDirectIndexBlocks();
                            actionButton.disabled = true;  // Disable the index button
                        } else if (directIndexBoxes.includes(box) && box.classList.contains('glow-blue')) {
                            console.log('Direct index block selected:', box.textContent);
                            box.classList.remove('glow-blue');
                            box.classList.add('blue');
                            selectedDirectIndexes.add(box);
                            if (selectedDirectIndexes.size === directIndexBoxes.length) {
                                highlightDataBlocks();
                                dataButton.disabled = false;   // Enable the data button
                            }
                        } else if (dataActivated && box.classList.contains('glow-green')) {
                            console.log('Data block selected:', box.textContent);
                            box.classList.remove('glow-green');
                            box.classList.add('green');
                            selectedDataBoxes.add(box);
                            checkWinCondition();
                        } else if (!indexHighlighted && box !== indexBox1) {
                            console.error('Wrong block clicked:', box.textContent);
                            alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                            resetGame();
                        } else if (dataActivated && !box.classList.contains('glow-green')) {
                            console.error('Wrong data block clicked:', box.textContent);
                            alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                            resetGame();
                        }
                    } else if (dataActivated && box.classList.contains('glow-green')) {
                        console.log('Data block selected:', box.textContent);
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition();
                    } else if (dataActivated && !box.classList.contains('glow-green')) {
                        console.error('Wrong data block clicked:', box.textContent);
                        alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                        resetGame();
                    }
                } catch (error) {
                    console.error('Error handling block click:', error);
                }
            });
            board.appendChild(box);
        }

        // Function to highlight direct index blocks
        function highlightDirectIndexBlocks() {
            console.log('Highlighting direct index blocks...');
            directIndexBoxes.forEach(box => {
                box.classList.add('glow-blue');
            });
        }

        // Function to highlight data blocks
        function highlightDataBlocks() {
            console.log('Highlighting data blocks...');
            dataBoxes.forEach(box => {
                box.classList.add('glow-green');
            });
        }

        // Function to check if the user has selected all the correct data blocks
        function checkWinCondition() {
            if (selectedDataBoxes.size === dataBoxes.length) {
                console.log('All data blocks selected correctly. User wins!');
                alert('Congratulations! You have followed the entire chain and won the game!');
            }
        }

        // Activate button click event
        actionButton.addEventListener('click', () => {
            try {
                activateClick = true;
                if (!indexHighlighted) {
                    indexBox1.classList.add('glow-blue');
                    indexHighlighted = true;
                    console.log('Index button clicked. Index block highlighted.');
                }
            } catch (error) {
                console.error('Error activating index button:', error);
            }
        });

        // Data button click event
        dataButton.addEventListener('click', () => {
            try {
                dataActivated = true;
                console.log('Data button clicked. Data blocks activated.');
            } catch (error) {
                console.error('Error activating data button:', error);
            }
        });
    }

    // Hard mode setup
    function startHardMode() {
        console.log('Starting Hard Mode...');
        // Generate random index numbers, secondary index numbers, and data numbers for two files
        const [indexNumber1, indexNumber2, ...rest] = generateUniqueNumbers(10, 144);
        const directIndexNumbers1 = generateUniqueNumbers(3, 144).filter(num => num !== indexNumber1 && num !== indexNumber2);
        const indirectIndexNumbers1 = generateUniqueNumbers(2, 144).filter(num => !directIndexNumbers1.includes(num) && num !== indexNumber1 && num !== indexNumber2);
        const directIndexNumbers2 = generateUniqueNumbers(3, 144).filter(num => !directIndexNumbers1.includes(num) && num !== indexNumber1 && num !== indexNumber2);
        const indirectIndexNumbers2 = generateUniqueNumbers(2, 144).filter(num => !indirectIndexNumbers1.includes(num) && num !== indexNumber1 && num !== indexNumber2);

        const dataNumbersArray1 = generateUniqueNumbers(40, 144).filter(num => !indirectIndexNumbers1.includes(num) && !directIndexNumbers1.includes(num) && num !== indexNumber1 && num !== indexNumber2);
        const dataNumbersArray2 = generateUniqueNumbers(40, 144).filter(num => !indirectIndexNumbers2.includes(num) && !directIndexNumbers2.includes(num) && num !== indexNumber1 && num !== indexNumber2);

        console.log("Index Numbers:", indexNumber1, indexNumber2);  // For debugging
        console.log("Direct Index Numbers 1:", directIndexNumbers1);  // For debugging
        console.log("Indirect Index Numbers 1:", indirectIndexNumbers1);  // For debugging
        console.log("Direct Index Numbers 2:", directIndexNumbers2);  // For debugging
        console.log("Indirect Index Numbers 2:", indirectIndexNumbers2);  // For debugging
        console.log("Data Numbers 1:", dataNumbersArray1);  // For debugging
        console.log("Data Numbers 2:", dataNumbersArray2);  // For debugging

        const allDirectIndexNumbers = [...directIndexNumbers1, ...directIndexNumbers2];
        const allIndirectIndexNumbers = [...indirectIndexNumbers1, ...indirectIndexNumbers2];
        const allDataNumbers = [...dataNumbersArray1, ...dataNumbersArray2];

        // Generate the 12x12 board
        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber1) {
                indexBox1 = box;
                box.classList.add('index1');
            } else if (parseInt(box.textContent) === indexNumber2) {
                indexBox2 = box;
                box.classList.add('index2');
            } else if (directIndexNumbers1.includes(parseInt(box.textContent))) {
                box.classList.add('direct1');
            } else if (indirectIndexNumbers1.includes(parseInt(box.textContent))) {
                box.classList.add('indirect1');
            } else if (directIndexNumbers2.includes(parseInt(box.textContent))) {
                box.classList.add('direct2');
            } else if (indirectIndexNumbers2.includes(parseInt(box.textContent))) {
                box.classList.add('indirect2');
            } else if (dataNumbersArray1.includes(parseInt(box.textContent))) {
                box.classList.add('data1');
            } else if (dataNumbersArray2.includes(parseInt(box.textContent))) {
                box.classList.add('data2');
            }

            box.addEventListener('click', () => {
                try {
                    if (activateClick) {
                        if (currentFile === 1) {
                            if (phase === 'direct') {
                                if (directIndexNumbers1.includes(parseInt(box.textContent)) && box.classList.contains('glow-orange')) {
                                    console.log('Direct index block for file 1 selected:', box.textContent);
                                    box.classList.remove('glow-orange');
                                    box.classList.add('orange');
                                    selectedDirectIndexes.add(box);
                                    if (selectedDirectIndexes.size === directIndexNumbers1.length) {
                                        phase = 'indirect';
                                        highlightIndirectIndexBlocks1();
                                    }
                                } else if (box.classList.contains('index1') && box.classList.contains('glow-blue')) {
                                    console.log('Index block for file 1 selected:', box.textContent);
                                    box.classList.remove('glow-blue');
                                    box.classList.add('blue');
                                    indexHighlighted = false;
                                    highlightDirectIndexBlocks1();
                                    actionButton.disabled = true;  // Disable the index button
                                } else if (box.classList.contains('index1') && !box.classList.contains('glow-blue')) {
                                    console.error('Wrong block clicked for file 1:', box.textContent);
                                    alert('Wrong block clicked for file 1! Restarting the game.');
                                    resetGame();
                                } else if (phase === 'indirect' && indirectIndexNumbers1.includes(parseInt(box.textContent)) && box.classList.contains('glow-blue')) {
                                    console.log('Indirect index block for file 1 selected:', box.textContent);
                                    box.classList.remove('glow-blue');
                                    box.classList.add('blue');
                                    selectedIndirectIndexes.add(box);
                                    if (selectedIndirectIndexes.size === indirectIndexNumbers1.length) {
                                        highlightDataBlocks1();
                                        dataButton.disabled = false;   // Enable the data button
                                    }
                                } else if (dataActivated && box.classList.contains('data1') && box.classList.contains('glow-green')) {
                                    console.log('Data block for file 1 selected:', box.textContent);
                                    box.classList.remove('glow-green');
                                    box.classList.add('green');
                                    selectedDataBoxes.add(box);
                                    checkWinCondition1();
                                } else if (dataActivated && !box.classList.contains('glow-green')) {
                                    console.error('Wrong data block clicked for file 1:', box.textContent);
                                    alert('Wrong data block clicked! This block is not part of the file. Restarting the game.');
                                    resetGame();
                                }
                            }
                        } else if (currentFile === 2) {
                            if (phase === 'direct') {
                                if (directIndexNumbers2.includes(parseInt(box.textContent)) && box.classList.contains('glow-light-orange')) {
                                    console.log('Direct index block for file 2 selected:', box.textContent);
                                    box.classList.remove('glow-light-orange');
                                    box.classList.add('light-orange');
                                    selectedDirectIndexes.add(box);
                                    if (selectedDirectIndexes.size === directIndexNumbers2.length) {
                                        phase = 'indirect';
                                        highlightIndirectIndexBlocks2();
                                    }
                                } else if (box.classList.contains('index2') && box.classList.contains('glow-light-blue')) {
                                    console.log('Index block for file 2 selected:', box.textContent);
                                    box.classList.remove('glow-light-blue');
                                    box.classList.add('light-blue');
                                    indexHighlighted = false;
                                    highlightDirectIndexBlocks2();
                                    actionButton.disabled = true;  // Disable the index button
                                } else if (box.classList.contains('index2') && !box.classList.contains('glow-light-blue')) {
                                    console.error('Wrong block clicked for file 2:', box.textContent);
                                    alert('Wrong block clicked for file 2! Restarting the game.');
                                    resetGame();
                                } else if (phase === 'indirect' && indirectIndexNumbers2.includes(parseInt(box.textContent)) && box.classList.contains('glow-light-blue')) {
                                    console.log('Indirect index block for file 2 selected:', box.textContent);
                                    box.classList.remove('glow-light-blue');
                                    box.classList.add('light-blue');
                                    selectedIndirectIndexes.add(box);
                                    if (selectedIndirectIndexes.size === indirectIndexNumbers2.length) {
                                        highlightDataBlocks2();
                                        dataButton.disabled = false;   // Enable the data button
                                    }
                                } else if (dataActivated && box.classList.contains('data2') && box.classList.contains('glow-light-green')) {
                                    console.log('Data block for file 2 selected:', box.textContent);
                                    box.classList.remove('glow-light-green');
                                    box.classList.add('light-green');
                                    selectedDataBoxes.add(box);
                                    checkWinCondition2();
                                } else if (dataActivated && !box.classList.contains('glow-light-green')) {
                                    console.error('Wrong data block clicked for file 2:', box.textContent);
                                    alert('Wrong data block clicked! This block is not part of the file. Restarting the game.');
                                    resetGame();
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error handling block click:', error);
                }
            });
            board.appendChild(box);
        }

        // Function to highlight direct index blocks for file 1
        function highlightDirectIndexBlocks1() {
            console.log('Highlighting direct index blocks for file 1...');
            directIndexNumbers1.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-orange');
                }
            });
        }

        // Function to highlight indirect index blocks for file 1
        function highlightIndirectIndexBlocks1() {
            console.log('Highlighting indirect index blocks for file 1...');
            indirectIndexNumbers1.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-blue');
                }
            });
        }

        // Function to highlight data blocks for file 1
        function highlightDataBlocks1() {
            console.log('Highlighting data blocks for file 1...');
            dataBoxes.forEach(box => {
                if (box.classList.contains('data1')) {
                    box.classList.add('glow-green');
                }
            });
        }

        // Function to highlight direct index blocks for file 2
        function highlightDirectIndexBlocks2() {
            console.log('Highlighting direct index blocks for file 2...');
            directIndexNumbers2.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-light-orange');
                }
            });
        }

        // Function to highlight indirect index blocks for file 2
        function highlightIndirectIndexBlocks2() {
            console.log('Highlighting indirect index blocks for file 2...');
            indirectIndexNumbers2.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-light-blue');
                }
            });
        }

        // Function to highlight data blocks for file 2
        function highlightDataBlocks2() {
            console.log('Highlighting data blocks for file 2...');
            dataBoxes.forEach(box => {
                if (box.classList.contains('data2')) {
                    box.classList.add('glow-light-green');
                }
            });
        }

        // Function to check if the user has selected all the correct data blocks for file 1
        function checkWinCondition1() {
            if (selectedDataBoxes.size === dataNumbersArray1.length) {
                console.log('All data blocks for file 1 selected correctly. Proceed to file 2.');
                alert('Congratulations! You have completed the first file!');
                currentFile = 2;
                actionButton.disabled = false;
                dataButton.disabled = true;
                activateClick = false;
                dataActivated = false;
                selectedDirectIndexes.clear();
                selectedIndirectIndexes.clear();
                selectedDataBoxes.clear();
                phase = 'direct';
                indexBox2.classList.add('glow-light-blue');
            }
        }

        // Function to check if the user has selected all the correct data blocks for file 2
        function checkWinCondition2() {
            if (selectedDataBoxes.size === dataNumbersArray2.length) {
                console.log('All data blocks for file 2 selected correctly. User wins!');
                alert('Congratulations! You have completed the second file and won the game!');
            }
        }

        // Activate button click event
        actionButton.addEventListener('click', () => {
            try {
                activateClick = true;
                if (!indexHighlighted) {
                    if (currentFile === 1) {
                        indexBox1.classList.add('glow-blue');
                    } else if (currentFile === 2) {
                        indexBox2.classList.add('glow-light-blue');
                    }
                    indexHighlighted = true;
                    console.log('Index button clicked. Index block highlighted.');
                }
            } catch (error) {
                console.error('Error activating index button:', error);
            }
        });

        // Data button click event
        dataButton.addEventListener('click', () => {
            try {
                dataActivated = true;
                console.log('Data button clicked. Data blocks activated.');
                if (currentFile === 1) {
                    highlightDataBlocks1();
                } else if (currentFile === 2) {
                    highlightDataBlocks2();
                }
            } catch (error) {
                console.error('Error activating data button:', error);
            }
        });
    }

    // Event listeners for mode buttons
    easyButton.addEventListener('click', () => {
        try {
            mode = 'easy';
            initializeGame();
        } catch (error) {
            console.error('Error starting easy mode:', error);
        }
    });

    mediumButton.addEventListener('click', () => {
        try {
            mode = 'medium';
            initializeGame();
        } catch (error) {
            console.error('Error starting medium mode:', error);
        }
    });

    hardButton.addEventListener('click', () => {
        try {
            mode = 'hard';
            initializeGame();
        } catch (error) {
            console.error('Error starting hard mode:', error);
        }
    });

    // Restart button click event
    restartButton.addEventListener('click', () => {
        try {
            resetGame();
        } catch (error) {
            console.error('Error restarting game:', error);
        }
    });

    // Initialize the game with default mode
    initializeGame();
});

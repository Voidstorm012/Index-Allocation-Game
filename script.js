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
    let secondaryIndexBoxes = [];
    let selectedSecondaryIndexes = new Set();
    let dataBoxes = [];
    let selectedDataBoxes = new Set();
    let mode = 'easy';
    let currentFile = 1;

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
        window.location.reload(); // Simple way to reset the game
    }

    // Function to initialize the game
    function initializeGame() {
        board.innerHTML = ''; // Clear the board
        actionButton.disabled = false;
        dataButton.disabled = true;
        selectedDataBoxes.clear();
        selectedSecondaryIndexes.clear();
        activateClick = false;
        indexHighlighted = false;
        dataActivated = false;
        secondaryIndexBoxes = [];
        dataBoxes = [];
        currentFile = 1;

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
                if (activateClick) {
                    if (box === indexBox1 && box.classList.contains('glow-blue')) {
                        box.classList.remove('glow-blue');
                        box.classList.add('blue');
                        indexHighlighted = false;
                        highlightDataBlocks();
                        actionButton.disabled = true;  // Disable the index button
                        dataButton.disabled = false;   // Enable the data button
                        activateClick = false; // Disable further blue selection
                    } else if (dataActivated && box.classList.contains('glow-green')) {
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition();
                    } else if (box !== indexBox1 && !dataNumbersArray.includes(parseInt(box.textContent))) {
                        alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                        resetGame();
                    }
                } else if (dataActivated && box.classList.contains('glow-green')) {
                    box.classList.remove('glow-green');
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkWinCondition();
                } else if (dataActivated && !box.classList.contains('glow-green')) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
        }

        // Function to highlight data blocks
        function highlightDataBlocks() {
            dataBoxes.forEach(box => {
                box.classList.add('glow-green');
            });
        }

        // Function to check if the user has selected all the correct data blocks
        function checkWinCondition() {
            if (selectedDataBoxes.size === dataBoxes.length) {
                alert('Congratulations! You have followed the entire chain and won the game!');
            }
        }

        // Activate button click event
        actionButton.addEventListener('click', () => {
            activateClick = true;
            if (!indexHighlighted) {
                indexBox1.classList.add('glow-blue');
                indexHighlighted = true;
            }
        });

        // Data button click event
        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });
    }

    // Medium mode setup
    function startMediumMode() {
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
                secondaryIndexBoxes.push(box);
            } else if (dataNumbersArray.includes(parseInt(box.textContent))) {
                dataBoxes.push(box);
            }

            box.addEventListener('click', () => {
                if (activateClick) {
                    if (box === indexBox1 && box.classList.contains('glow-blue')) {
                        box.classList.remove('glow-blue');
                        box.classList.add('blue');
                        indexHighlighted = false;
                        highlightSecondaryIndexBlocks();
                        actionButton.disabled = true;  // Disable the index button
                    } else if (secondaryIndexBoxes.includes(box) && box.classList.contains('glow-blue')) {
                        box.classList.remove('glow-blue');
                        box.classList.add('blue');
                        selectedSecondaryIndexes.add(box);
                        if (selectedSecondaryIndexes.size === secondaryIndexBoxes.length) {
                            highlightDataBlocks();
                            dataButton.disabled = false;   // Enable the data button
                        }
                    } else if (dataActivated && box.classList.contains('glow-green')) {
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition();
                    } else if (!indexHighlighted && box !== indexBox1) {
                        alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                        resetGame();
                    } else if (dataActivated && !box.classList.contains('glow-green')) {
                        alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                        resetGame();
                    }
                } else if (dataActivated && box.classList.contains('glow-green')) {
                    box.classList.remove('glow-green');
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkWinCondition();
                } else if (dataActivated && !box.classList.contains('glow-green')) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
        }

        // Function to highlight secondary index blocks
        function highlightSecondaryIndexBlocks() {
            secondaryIndexBoxes.forEach(box => {
                box.classList.add('glow-blue');
            });
        }

        // Function to highlight data blocks
        function highlightDataBlocks() {
            dataBoxes.forEach(box => {
                box.classList.add('glow-green');
            });
        }

        // Function to check if the user has selected all the correct data blocks
        function checkWinCondition() {
            if (selectedDataBoxes.size === dataBoxes.length) {
                alert('Congratulations! You have followed the entire chain and won the game!');
            }
        }

        // Activate button click event
        actionButton.addEventListener('click', () => {
            activateClick = true;
            if (!indexHighlighted) {
                indexBox1.classList.add('glow-blue');
                indexHighlighted = true;
            }
        });

        // Data button click event
        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });
    }

    // Hard mode setup
    function startHardMode() {
        // Generate random index numbers, secondary index numbers, and data numbers for two files
        const [indexNumber1, indexNumber2, ...rest] = generateUniqueNumbers(8, 144);
        const secondaryIndexNumbers1 = generateUniqueNumbers(2, 144).filter(num => num !== indexNumber1 && num !== indexNumber2);
        const secondaryIndexNumbers2 = generateUniqueNumbers(2, 144).filter(num => !secondaryIndexNumbers1.includes(num) && num !== indexNumber1 && num !== indexNumber2);

        const dataNumbersArray1 = generateUniqueNumbers(40, 144).filter(num => !secondaryIndexNumbers1.includes(num) && num !== indexNumber1 && num !== indexNumber2);
        const dataNumbersArray2 = generateUniqueNumbers(40, 144).filter(num => !secondaryIndexNumbers2.includes(num) && num !== indexNumber1 && num !== indexNumber2);

        console.log("Index Numbers:", indexNumber1, indexNumber2);  // For debugging
        console.log("Secondary Index Numbers 1:", secondaryIndexNumbers1);  // For debugging
        console.log("Secondary Index Numbers 2:", secondaryIndexNumbers2);  // For debugging
        console.log("Data Numbers 1:", dataNumbersArray1);  // For debugging
        console.log("Data Numbers 2:", dataNumbersArray2);  // For debugging

        const allSecondaryIndexNumbers = [...secondaryIndexNumbers1, ...secondaryIndexNumbers2];
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
            } else if (secondaryIndexNumbers1.includes(parseInt(box.textContent))) {
                box.classList.add('secondary1');
            } else if (secondaryIndexNumbers2.includes(parseInt(box.textContent))) {
                box.classList.add('secondary2');
            } else if (dataNumbersArray1.includes(parseInt(box.textContent))) {
                box.classList.add('data1');
            } else if (dataNumbersArray2.includes(parseInt(box.textContent))) {
                box.classList.add('data2');
            }

            box.addEventListener('click', () => {
                if (activateClick) {
                    if (currentFile === 1) {
                        if (box === indexBox1 && box.classList.contains('glow-blue')) {
                            box.classList.remove('glow-blue');
                            box.classList.add('blue');
                            highlightSecondaryIndexBlocks1();
                            actionButton.disabled = true;  // Disable the index button
                        } else if (secondaryIndexNumbers1.includes(parseInt(box.textContent)) && box.classList.contains('glow-blue')) {
                            box.classList.remove('glow-blue');
                            box.classList.add('blue');
                            selectedSecondaryIndexes.add(box);
                            if (selectedSecondaryIndexes.size === secondaryIndexNumbers1.length) {
                                highlightDataBlocks1();
                                dataButton.disabled = false;   // Enable the data button
                            }
                        } else if (dataActivated && box.classList.contains('data1') && box.classList.contains('glow-green')) {
                            box.classList.remove('glow-green');
                            box.classList.add('green');
                            selectedDataBoxes.add(box);
                            checkWinCondition1();
                        } else if (box.classList.contains('index1') && !box.classList.contains('glow-blue')) {
                            alert('Wrong block clicked for file 1! Restarting the game.');
                            resetGame();
                        } else if (dataActivated && !box.classList.contains('glow-green')) {
                            alert('Wrong data block clicked! This block is not part of the file. Restarting the game.');
                            resetGame();
                        }
                    } else if (currentFile === 2) {
                        if (box === indexBox2 && box.classList.contains('glow-red')) {
                            box.classList.remove('glow-red');
                            box.classList.add('red');
                            highlightSecondaryIndexBlocks2();
                            actionButton.disabled = true;  // Disable the index button
                        } else if (secondaryIndexNumbers2.includes(parseInt(box.textContent)) && box.classList.contains('glow-red')) {
                            box.classList.remove('glow-red');
                            box.classList.add('red');
                            selectedSecondaryIndexes.add(box);
                            if (selectedSecondaryIndexes.size === secondaryIndexNumbers2.length) {
                                highlightDataBlocks2();
                                dataButton.disabled = false;   // Enable the data button
                            }
                        } else if (dataActivated && box.classList.contains('data2') && box.classList.contains('glow-red')) {
                            box.classList.remove('glow-red');
                            box.classList.add('red');
                            selectedDataBoxes.add(box);
                            checkWinCondition2();
                        } else if (box.classList.contains('index2') && !box.classList.contains('glow-red')) {
                            alert('Wrong block clicked for file 2! Restarting the game.');
                            resetGame();
                        } else if (dataActivated && !box.classList.contains('glow-red')) {
                            alert('Wrong data block clicked! This block is not part of the file. Restarting the game.');
                            resetGame();
                        }
                    }
                } else if (dataActivated && (box.classList.contains('glow-green') || box.classList.contains('glow-red'))) {
                    if (box.classList.contains('glow-green')) {
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                    } else if (box.classList.contains('glow-red')) {
                        box.classList.remove('glow-red');
                        box.classList.add('red');
                    }
                    selectedDataBoxes.add(box);
                    checkWinCondition();
                } else if (dataActivated && (!box.classList.contains('glow-green') && !box.classList.contains('glow-red'))) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
        }

        // Function to highlight secondary index blocks for file 1
        function highlightSecondaryIndexBlocks1() {
            secondaryIndexNumbers1.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-blue');
                }
            });
        }

        // Function to highlight secondary index blocks for file 2
        function highlightSecondaryIndexBlocks2() {
            secondaryIndexNumbers2.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-red');
                }
            });
        }

        // Function to highlight data blocks for file 1
        function highlightDataBlocks1() {
            dataBoxes.forEach(box => {
                if (box.classList.contains('data1')) {
                    box.classList.add('glow-green');
                }
            });
        }

        // Function to highlight data blocks for file 2
        function highlightDataBlocks2() {
            dataBoxes.forEach(box => {
                if (box.classList.contains('data2')) {
                    box.classList.add('glow-red');
                }
            });
        }

        // Function to check if the user has selected all the correct data blocks for file 1
        function checkWinCondition1() {
            if (selectedDataBoxes.size === dataNumbersArray1.length) {
                alert('Congratulations! You have completed the first file!');
                currentFile = 2;
                actionButton.disabled = false;
                dataButton.disabled = true;
                activateClick = false;
                dataActivated = false;
                selectedSecondaryIndexes.clear();
                selectedDataBoxes.clear();
                indexBox2.classList.add('glow-red');
            }
        }

        // Function to check if the user has selected all the correct data blocks for file 2
        function checkWinCondition2() {
            if (selectedDataBoxes.size === dataNumbersArray2.length) {
                alert('Congratulations! You have completed the second file and won the game!');
            }
        }

        // Activate button click event
        actionButton.addEventListener('click', () => {
            activateClick = true;
            if (!indexHighlighted) {
                if (currentFile === 1) {
                    indexBox1.classList.add('glow-blue');
                } else if (currentFile === 2) {
                    indexBox2.classList.add('glow-red');
                }
                indexHighlighted = true;
            }
        });

        // Data button click event
        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });
    }

    // Event listeners for mode buttons
    easyButton.addEventListener('click', () => {
        mode = 'easy';
        initializeGame();
    });

    mediumButton.addEventListener('click', () => {
        mode = 'medium';
        initializeGame();
    });

    hardButton.addEventListener('click', () => {
        mode = 'hard';
        initializeGame();
    });

    // Restart button click event
    restartButton.addEventListener('click', () => {
        resetGame();
    });

    // Initialize the game with default mode
    initializeGame();
});

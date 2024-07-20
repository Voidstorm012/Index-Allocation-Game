document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const actionButton = document.getElementById('action-button');
    const dataButton = document.getElementById('data-button');
    const restartButton = document.getElementById('restart-button');
    const instructionText = document.getElementById('instruction-text');
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
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
    let mode = new URLSearchParams(window.location.search).get('mode');
    let currentFile = 1;

    if (result === 'win') {
        titleElement.textContent = 'Congratulations!';
        descriptionElement.textContent = 'You have completed the game.';
        triggerConfetti();
    } else if (result === 'lose') {
        titleElement.textContent = 'Game Over';
        descriptionElement.textContent = 'You have lost the game. Try again!';
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

        if (mode === 'easy') {
            startEasyMode();
        } else if (mode === 'medium') {
            startMediumMode();
        } else if (mode === 'hard') {
            startHardMode();
        }
    }

    function startEasyMode() {
        instructionText.textContent = 'Select the index block by clicking the "Index" button and then the highlighted block.';

        const [indexNumber, ...dataNumbers] = generateUniqueNumbers(7, 144);
        const dataNumbersArray = [...dataNumbers];

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
                    if (box === indexBox && box.classList.contains('glow-blue')) {
                        box.classList.remove('glow-blue');
                        box.classList.add('blue');
                        indexHighlighted = false;
                        highlightDataBlocks(dataBoxes, 'green');
                        actionButton.disabled = true;
                        dataButton.disabled = false;
                        activateClick = false;
                        instructionText.textContent = 'Select the data blocks by clicking the highlighted blocks.';
                    } else if (dataActivated && box.classList.contains('glow-green')) {
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition(dataBoxes);
                    } else if (box !== indexBox && !dataNumbersArray.includes(parseInt(box.textContent))) {
                        alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                        resetGame();
                    }
                } else if (dataActivated && box.classList.contains('glow-green')) {
                    box.classList.remove('glow-green');
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkWinCondition(dataBoxes);
                } else if (dataActivated && !box.classList.contains('glow-green')) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
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
            if (!indexHighlighted) {
                indexBox.classList.add('glow-blue');
                indexHighlighted = true;
            }
        });

        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });
    }

    function startMediumMode() {
        instructionText.textContent = 'Select the first-level index block by clicking the "Index" button and then the highlighted block.';

        const [indexNumber, ...secondaryIndexNumbers] = generateUniqueNumbers(3, 144);
        const dataNumbersArray = generateUniqueNumbers(6, 144).filter(num => !secondaryIndexNumbers.includes(num) && num !== indexNumber);

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
                    if (box === indexBox && box.classList.contains('glow-blue')) {
                        box.classList.remove('glow-blue');
                        box.classList.add('blue');
                        indexHighlighted = false;
                        highlightDirectIndexBlocks(directIndexBoxes);
                        actionButton.disabled = true;
                        instructionText.textContent = 'Now select the second-level index blocks by clicking the highlighted blocks.';
                    } else if (directIndexBoxes.includes(box) && box.classList.contains('glow-blue')) {
                        box.classList.remove('glow-blue');
                        box.classList.add('blue');
                        selectedDirectIndexes.add(box);
                        if (selectedDirectIndexes.size === directIndexBoxes.length) {
                            highlightDataBlocks(dataBoxes, 'green');
                            dataButton.disabled = false;
                            instructionText.textContent = 'Select the data blocks by clicking the highlighted blocks.';
                        }
                    } else if (dataActivated && box.classList.contains('glow-green')) {
                        box.classList.remove('glow-green');
                        box.classList.add('green');
                        selectedDataBoxes.add(box);
                        checkWinCondition(dataBoxes);
                    } else if (!indexHighlighted && box !== indexBox) {
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
                    checkWinCondition(dataBoxes);
                } else if (dataActivated && !box.classList.contains('glow-green')) {
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
            if (!indexHighlighted) {
                indexBox.classList.add('glow-blue');
                indexHighlighted = true;
            }
        });

        dataButton.addEventListener('click', () => {
            dataActivated = true;
        });
    }

    function startHardMode() {
        instructionText.textContent = 'Select the first index block by clicking the "Index" button and then the highlighted block.';

        const indexNumber1 = generateUniqueNumbers(1, 144)[0];
        const directIndexNumbers1 = generateUniqueNumbers(3, 144, [indexNumber1]);
        const indirectIndexNumbers1 = generateUniqueNumbers(2, 144, [indexNumber1, ...directIndexNumbers1]);
        const dataNumbersArray1 = generateUniqueNumbers(40, 144, [indexNumber1, ...directIndexNumbers1, ...indirectIndexNumbers1]);

        const indexNumber2 = generateUniqueNumbers(1, 144, [indexNumber1, ...directIndexNumbers1, ...indirectIndexNumbers1, ...dataNumbersArray1])[0];
        const directIndexNumbers2 = generateUniqueNumbers(3, 144, [indexNumber1, indexNumber2, ...directIndexNumbers1, ...indirectIndexNumbers1, ...dataNumbersArray1]);
        const indirectIndexNumbers2 = generateUniqueNumbers(2, 144, [indexNumber1, indexNumber2, ...directIndexNumbers1, ...directIndexNumbers2, ...indirectIndexNumbers1, ...dataNumbersArray1]);
        const dataNumbersArray2 = generateUniqueNumbers(40, 144, [indexNumber1, indexNumber2, ...directIndexNumbers1, ...directIndexNumbers2, ...indirectIndexNumbers1, ...indirectIndexNumbers2, ...dataNumbersArray1]);

        for (let i = 0; i < 144; i++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = i + 1;

            if (parseInt(box.textContent) === indexNumber1) {
                indexBox = box;
                box.classList.add('index1');
            } else if (parseInt(box.textContent) === indexNumber2) {
                indexBox2 = box;
                box.classList.add('index2');
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
                        if (box === indexBox && box.classList.contains('glow-blue')) {
                            box.classList.remove('glow-blue');
                            box.classList.add('blue');
                            indexHighlighted = false;
                            highlightDirectIndexBlocks1();
                            actionButton.disabled = true;
                            instructionText.textContent = 'Now select the direct index blocks for file 1.';
                        } else if (directIndexBoxes.includes(box) && box.classList.contains('glow-orange')) {
                            box.classList.remove('glow-orange');
                            box.classList.add('orange');
                            selectedDirectIndexes.add(box);
                            if (selectedDirectIndexes.size === directIndexNumbers1.length) {
                                highlightIndirectIndexBlocks1();
                                instructionText.textContent = 'Now select the indirect index blocks for file 1.';
                            }
                        } else if (indirectIndexBoxes.includes(box) && box.classList.contains('glow-orange')) {
                            box.classList.remove('glow-orange');
                            box.classList.add('orange');
                            selectedIndirectIndexes.add(box);
                            if (selectedIndirectIndexes.size === indirectIndexNumbers1.length) {
                                highlightDataBlocks1();
                                dataButton.disabled = false;
                                instructionText.textContent = 'Select the data blocks for file 1 by clicking the highlighted blocks.';
                            }
                        } else if (dataActivated && box.classList.contains('glow-green')) {
                            box.classList.remove('glow-green');
                            box.classList.add('green');
                            selectedDataBoxes.add(box);
                            checkWinCondition1();
                        } else if (!indexHighlighted && box !== indexBox) {
                            alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                            resetGame();
                        } else if (dataActivated && !box.classList.contains('glow-green')) {
                            alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                            resetGame();
                        }
                    } else if (currentFile === 2) {
                        if (box === indexBox2 && box.classList.contains('glow-light-blue')) {
                            box.classList.remove('glow-light-blue');
                            box.classList.add('light-blue');
                            indexHighlighted = false;
                            highlightDirectIndexBlocks2();
                            actionButton.disabled = true;
                            instructionText.textContent = 'Now select the direct index blocks for file 2.';
                        } else if (directIndexBoxes.includes(box) && box.classList.contains('glow-light-orange')) {
                            box.classList.remove('glow-light-orange');
                            box.classList.add('light-orange');
                            selectedDirectIndexes.add(box);
                            if (selectedDirectIndexes.size === directIndexNumbers2.length) {
                                highlightIndirectIndexBlocks2();
                                instructionText.textContent = 'Now select the indirect index blocks for file 2.';
                            }
                        } else if (indirectIndexBoxes.includes(box) && box.classList.contains('glow-light-orange')) {
                            box.classList.remove('glow-light-orange');
                            box.classList.add('light-orange');
                            selectedIndirectIndexes.add(box);
                            if (selectedIndirectIndexes.size === indirectIndexNumbers2.length) {
                                highlightDataBlocks2();
                                dataButton.disabled = false;
                                instructionText.textContent = 'Select the data blocks for file 2 by clicking the highlighted blocks.';
                            }
                        } else if (dataActivated && box.classList.contains('glow-light-green')) {
                            box.classList.remove('glow-light-green');
                            box.classList.add('light-green');
                            selectedDataBoxes.add(box);
                            checkWinCondition2();
                        } else if (!indexHighlighted && box !== indexBox2) {
                            alert('Wrong block clicked! You clicked a block that is not part of the file. Restarting the game.');
                            resetGame();
                        } else if (dataActivated && !box.classList.contains('glow-light-green')) {
                            alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                            resetGame();
                        }
                    }
                } else if (dataActivated && box.classList.contains('glow-green')) {
                    box.classList.remove('glow-green');
                    box.classList.add('green');
                    selectedDataBoxes.add(box);
                    checkWinCondition1();
                } else if (dataActivated && box.classList.contains('glow-light-green')) {
                    box.classList.remove('glow-light-green');
                    box.classList.add('light-green');
                    selectedDataBoxes.add(box);
                    checkWinCondition2();
                } else if (dataActivated && !box.classList.contains('glow-green') && !box.classList.contains('glow-light-green')) {
                    alert('Wrong data block clicked! This block is not part of the file according to the index block. Restarting the game.');
                    resetGame();
                }
            });
            board.appendChild(box);
        }

        function highlightDirectIndexBlocks1() {
            directIndexNumbers1.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-orange');
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

        function highlightDirectIndexBlocks2() {
            directIndexNumbers2.forEach(index => {
                const box = board.querySelector(`.box:nth-child(${index})`);
                if (box) {
                    box.classList.add('glow-light-orange');
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

        function highlightDataBlocks1() {
            dataBoxes.forEach(box => {
                box.classList.add('glow-green');
            });
        }

        function highlightDataBlocks2() {
            dataBoxes2.forEach(box => {
                box.classList.add('glow-light-green');
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
                indexBox2.classList.add('glow-light-blue');
                instructionText.textContent = 'Select the second index blockF by clicking the "Index" button and then the highlighted block.';
            }
        }

        function checkWinCondition2() {
            if (selectedDataBoxes.size === dataBoxes2.length) {
                window.location.href = `../result.html?result=win&mode=${mode}`;
            }
        }

        actionButton.addEventListener('click', () => {
            activateClick = true;
            if (!indexHighlighted) {
                if (currentFile === 1) {
                    indexBox.classList.add('glow-blue');
                } else if (currentFile === 2) {
                    indexBox2.classList.add('glow-light-blue');
                }
                indexHighlighted = true;
            }
        });

        dataButton.addEventListener('click', () => {
            dataActivated = true;
            if (currentFile === 1) {
                highlightDataBlocks1();
            } else if (currentFile === 2) {
                highlightDataBlocks2();
            }
        });
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
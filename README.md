# Index Allocation Game

This project is an educational game designed to teach the concepts of file allocation in operating systems, specifically focusing on indexed allocation methods. The game provides three difficulty levels: Easy, Medium, and Hard, each representing different file allocation schemes.

## Table of Contents

- [Features](#features)
- [How to Play](#how-to-play)
- [Setup](#setup)
- [Usage](#usage)
- [Game Modes](#game-modes)
- [Learn Theory](#learn-theory)
- [License](#license)

## Features

- **Easy Mode**: Single-level index allocation.
- **Medium Mode**: Two-level index allocation.
- **Hard Mode**: Multilevel index allocation with multiple files.
- **Interactive Gameplay**: Visual representation of file blocks and pointers.
- **Educational**: Helps users understand the file allocation concepts through an engaging game.

## How to Play

1. **Select a Difficulty**: Choose between Easy, Medium, and Hard modes.
2. **Index Selection**: Click the "Index" button to highlight the index block(s). Click the highlighted block to confirm your selection.
3. **Data Block Selection**: Click the "Data" button to highlight the data blocks. Click the highlighted blocks to confirm your selections.
4. **Win Condition**: Correctly select all the data blocks as per the index blocks to win the game.
5. **Restart**: Click the "Restart" button to start a new game.

## Setup

1. **Download the project**:
    - Clone the repository:
      ```sh
      git clone https://github.com/Voidstorm012/Index-Allocation-Game.git
      ```

    - Or download the ZIP file from the [repository](https://github.com/Voidstorm012/Index-Allocation-Game) and extract it.

2. **Navigate to the project directory**:
    ```sh
    cd Index-Allocation-Game
    ```

3. **Open `index.html` in your browser**.

## Usage

1. Open the `index.html` file in a web browser.
2. Select the desired difficulty level.
3. Follow the game instructions to complete the file allocation tasks.

## Game Modes

### Easy Mode (Linked Scheme)

**Description:**
In the linked scheme, each file is represented by a series of blocks linked together. This method is straightforward and easy to implement. Each block contains a pointer to the next block in the sequence.

**Advantages:**
- Simple implementation.
- Easy to insert and delete blocks.

**Disadvantages:**
- Can lead to external fragmentation.
- Requires additional overhead to maintain pointers.

### Medium Mode (Multilevel Index)

**Description:**
The multilevel index scheme uses multiple levels of index blocks to manage file allocation. It starts with a primary index block, which can point to other index blocks, and eventually to the actual data blocks.

**Advantages:**
- Reduces fragmentation.
- Provides better organization for large files.
- Efficient management of large files.

**Disadvantages:**
- More complex to implement.
- Requires multiple levels of pointers, increasing overhead.

### Hard Mode (Combined Scheme)

**Description:**
The combined scheme integrates both direct and indirect block pointers. Each file uses a combination of direct pointers, single-level indirect pointers, and multi-level indirect pointers.

**Advantages:**
- Minimizes fragmentation.
- Maximizes storage utilization.
- Balances ease of implementation with efficiency.

**Disadvantages:**
- More complex to manage.
- Requires careful handling of different block types.

## Learn Theory

The theory section of this project provides detailed explanations of various file allocation methods used in operating systems. It includes:

1. **File Allocation Methods**:
    - Contiguous Allocation: Blocks are stored sequentially.
    - Linked Allocation: Each file is a linked list of blocks.
    - Indexed Allocation: Uses index blocks to manage pointers to file blocks.

2. **Indexed Allocation**:
    - Single-Level Index: A single index block contains pointers to all data blocks.
    - Multilevel Index: Uses multiple levels of index blocks for better organization.
    - Combined Scheme: Integrates direct and indirect blocks for flexible file management.

3. **Advantages and Disadvantages**:
    - **Contiguous Allocation**:
        - Advantages: Simple and fast access.
        - Disadvantages: Can lead to fragmentation and is not flexible.
    - **Linked Allocation**:
        - Advantages: Flexible and no external fragmentation.
        - Disadvantages: Slower access due to sequential traversal.
    - **Indexed Allocation**:
        - Advantages: Provides efficient random access.
        - Disadvantages: More complex and requires additional overhead for maintaining index blocks.

4. **Practical Applications**:
    - Learn how these methods are implemented in real-world file systems.
    - Understand the trade-offs between different allocation strategies.

Users can access the theory page by clicking the "Learn Theory" button on the main menu to deepen their understanding of these concepts.

## License

Distributed under the MIT License. See `LICENSE` for more information.


# Index Allocation Game

This project is an educational game designed to teach the concepts of file allocation in operating systems, specifically focusing on indexed allocation methods. The game provides three difficulty levels: Easy, Medium, and Hard, each representing different file allocation schemes.

## Table of Contents

- [Features](#features)
- [How to Play](#how-to-play)
- [Setup](#setup)
- [Usage](#usage)
- [Game Modes](#game-modes)
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
      \`\`\`sh
      git clone https://github.com/Voidstorm012/Index-Allocation-Game.git
      \`\`\`

    - Or download the ZIP file from the [repository](https://github.com/Voidstorm012/Index-Allocation-Game) and extract it.

2. **Navigate to the project directory**:
    \`\`\`sh
    cd Index-Allocation-Game
    \`\`\`

3. **Open \`index.html\` in your browser**.

## Usage

1. Open the \`index.html\` file in a web browser.
2. Select the desired difficulty level.
3. Follow the game instructions to complete the file allocation tasks.

## Game Modes

### Easy Mode

- Single-level index allocation.
- One index block and multiple direct data blocks.

### Medium Mode

- Two-level index allocation.
- One primary index block pointing to secondary index blocks, which in turn point to data blocks.

### Hard Mode

- Multilevel index allocation with multiple files.
- Each file uses three direct blocks and two indirect blocks.
- Players complete one file at a time, ensuring a clear understanding of complex allocation methods.

## License

Distributed under the MIT License. See \`LICENSE\` for more information.

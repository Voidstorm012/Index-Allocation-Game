
# Indexed Allocation Game

This repository contains the Indexed Allocation Game, an educational tool designed to teach users about different file allocation methods in operating systems. The game includes three levels of difficulty, each representing a different allocation scheme.

## Levels

### Linked Scheme (Easy)
**Description:**
In the linked scheme, each file is represented by a series of blocks linked together. This method is straightforward and easy to implement. Each block contains a pointer to the next block in the sequence.

**Advantages:**
- Simple implementation.
- Easy to insert and delete blocks.

**Disadvantages:**
- Can lead to external fragmentation.
- Requires additional overhead to maintain pointers.

### Multilevel Index (Medium)
**Description:**
The multilevel index scheme uses multiple levels of index blocks to manage file allocation. It starts with a primary index block, which can point to other index blocks, and eventually to the actual data blocks.

**Advantages:**
- Reduces fragmentation.
- Provides better organization for large files.
- Efficient management of large files.

**Disadvantages:**
- More complex to implement.
- Requires multiple levels of pointers, increasing overhead.

### Combined Scheme (Hard)
**Description:**
The combined scheme integrates both direct and indirect block pointers. Each file uses a combination of direct pointers, single-level indirect pointers, and multi-level indirect pointers.

**Advantages:**
- Minimizes fragmentation.
- Maximizes storage utilization.
- Balances ease of implementation with efficiency.

**Disadvantages:**
- More complex to manage.
- Requires careful handling of different block types.

## How to Play
1. Select the desired difficulty level from the main menu.
2. Follow the on-screen instructions to allocate blocks according to the chosen scheme.
3. Use the "Index" button to select index blocks and the "Data" button to select data blocks.
4. Use the "Restart" button to restart the game or the "Back" button to return to the level selection menu.

## File Structure
- `index.html`: The main entry point for the game.
- `levels.html`: The level selection menu.
- `theory.html`: A page for learning the theory behind file allocation methods.
- `difficulty/`: Contains the HTML files for each difficulty level.
- `css/`: Contains the stylesheet for the game.
- `js/`: Contains the JavaScript logic for the game.
- `images/`: Contains image assets used in the game.

## Installation
1. Clone the repository: `git clone https://github.com/Voidstorm012/Index-Allocation-Game.git`
2. Open `index.html` in your preferred web browser to start the game.

## License
This project is licensed under the MIT License.

## Author
Created by Your Name, 2024.

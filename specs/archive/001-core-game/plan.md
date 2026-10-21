# Implementation Plan: Core Tic-Tac-Toe Game with Customizable Rules

**Feature Branch**: `001-core-game` | **Date**: 2026-06-28 | **Spec**: `specs/001-core-game/spec.md`

## Summary
Document the technical architecture of the existing vanilla HTML/CSS/JS Customizable Tic-Tac-Toe game. The application runs entirely client-side, dynamically rendering grids from 3x3 to 100x100 and executing a deterministic greedy evaluation algorithm.

## Technical Context

**Language/Version**: ES6+ JavaScript, HTML5, CSS3

**Primary Dependencies**: None (Pure standard Web APIs)

**Storage**: None (Session state is transient)

**Testing**: Visual and manual regression checks via browser developer tools.

**Target Platform**: Evergreen desktop and mobile web browsers.

**Project Type**: Single-page frontend web application.

**Performance Goals**: Instant board creation (<200ms) for common grid sizes, 60fps animations.

## Constitution Check
- **Modern Frontend Stack**: Checked. Completely vanilla, no compilation/transpilation or heavy build tools.
- **Greedy Line-Counting Engine**: Checked. Explicitly implemented inside `calculateWinningLinesForPlayer()` inside `script.js`.
- **Responsive Layout**: Checked. Responsive scroll boundaries around `#game-board` handle sizes up to 100x100 gracefully.
- **Web Audio API**: Checked. Sound effects are fully synthesized in real-time via `playTone()`.

## Project Structure

### Source Code
```text
/home/developer/repos/hector/3-en-raya/
├── index.html        # Main DOM layout, configuration menus, sound nodes, scoring displays
├── style.css         # CSS Grid logic, variables, theme, and line strike animations
├── script.js        # Core game loops, event handling, Web Audio generation, greedy search
```

## Architectural Design & State Management

### 1. Game State Structure
Stored in standard variables inside `script.js`:
- `config`: Objects with `{ rows, cols, winLength, targetLines, numPlayers }`.
- `board`: One-dimensional array of size $Rows \times Cols$, filled with player symbols (e.g. `'X'`, `'O'`, `'A'`) or `null` for empty cells.
- `currentPlayerIndex`: 0-based index of the player whose turn it is.
- `scores`: Map storing the score/lines completed by each player index.
- `allWinningLines`: Array of indices lists representing currently active strike lines.

### 2. The Greedy Line-Counting Algorithm (`calculateWinningLinesForPlayer`)
The algorithm calculates how many lines of length $N$ are completed by a player without reusing any cells in the same direction:
1. **Scanning**: Scans every cell of the board.
2. **Direction Vectors**: For each cell, checks four directions:
   - Horizontal (Right)
   - Vertical (Down)
   - Diagonal Down-Right
   - Diagonal Down-Left
3. **Verification**: Verifies if $N$ consecutive cells contain the specified player's symbol.
4. **Greedy Marking**: Once a line of length $N$ is found in a direction, the algorithm registers the line indices and marks those cells as "reused" for that specific direction. It continues scanning from the next cells.
5. **No Direction Conflict**: Reusing a cell across different directions is allowed (e.g. a vertical line and a horizontal line crossing at the same cell).

### 3. Dynamic Audio Generation (`playTone`)
Sound synthesis is driven by the Web Audio API:
- An `AudioContext` is created/resumed on user interaction.
- Uses `OscillatorNode` with `'square'` type and `GainNode` for volume envelope decay.
- Configurable frequencies and tones for click sounds, move actions, line completion, and victories.

## Next Steps & Validation
As a completed baseline feature, no further source modifications are planned. Future feature iterations must ensure compatibility with these core structures.

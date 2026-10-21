# Feature Specification: Core Tic-Tac-Toe Game with Customizable Rules

**Feature Branch**: `001-core-game`

**Created**: 2026-06-28

**Status**: Baseline / Implemented

**Input**: Existing codebase analysis (vanilla HTML5/CSS3/ES6+ JavaScript).

## User Scenarios & Testing

### User Story 1 - Local Multi-player Match with Preset Configuration (Priority: P1)
As two local players, we want to play a standard Tic-Tac-Toe game on preset board sizes (such as 3x3 with 3 in a row to win) so we can enjoy a classic match without configuring custom parameters.

**Why this priority**: It is the absolute core MVP. It enables the foundational game loop of players alternating turns, making moves, validating alignments, and declaring winners.

**Independent Test**: Can be tested by starting a game with the "3x3 Presets", selecting 2 Players, placing marks alternately on cells, and checking if the game correctly declares Player 1 or Player 2 as the winner when a 3-in-a-row is formed.

**Acceptance Scenarios**:
1. **Given** a 3x3 preset game is initiated with 2 players, **When** Player 1 clicks an empty cell, **Then** an "X" mark is placed, a custom move sound is played, and the turn switches to Player 2.
2. **Given** Player 2 has the turn, **When** they click an already occupied cell, **Then** no mark is placed, the turn does not switch, and no state changes.
3. **Given** Player 1 forms a horizontal line of 3 "X"s, **When** the line is formed, **Then** a victory strike-line is rendered visually, a custom line-gained sound is played, the score is updated, and the match is declared won by Player 1.

---

### User Story 2 - Customizable Grid and Custom Rules (Priority: P2)
As a player, I want to configure custom dimensions (rows and columns up to 100x100), custom alignment length (N), and target lines (K) so that I can play non-traditional variants of Tic-Tac-Toe.

**Why this priority**: This defines the unique selling proposition (USP) of this game—custom scalability.

**Independent Test**: Set the board size to 5x5, alignment length to 4, and target lines to 2, and verify that the grid renders as 5x5, that lines of length 4 are counted, and that a player must get 2 lines to win.

**Acceptance Scenarios**:
1. **Given** the user selects custom configuration, **When** they input rows=4, cols=4, winLength=4, targetLines=2, **Then** a 4x4 board is rendered, and players must form alignments of 4 marks to gain lines.
2. **Given** a target line objective $K > 1$, **When** a player forms a single line of length $N$, **Then** they gain a point, but the game continues until one player reaches $K$ total lines or the board is full.

---

### User Story 3 - Greedy Line-Counting Algorithm (Priority: P1)
As a player, I want lines to be counted strictly according to greedy rules (marks in a direction cannot be reused for another line in that same direction, but can cross lines in other directions) so that scoring is fair and logical.

**Why this priority**: Essential to ensure correct score accounting in large custom boards where multiple lines can align.

**Independent Test**: Place 6 "X"s in a single row on a large board when $N=3$. Verify that the game counts exactly 2 lines of 3 (cells 0-1-2 and cells 3-4-5) and awards 2 lines (points), while 4 or 5 "X"s in a row only counts as 1 line.

**Acceptance Scenarios**:
1. **Given** a player has 4 consecutive marks in a horizontal row when $N=3$, **When** scoring is recalculated, **Then** the first 3 marks count as 1 line and the 4th mark is ignored for horizontal lines.
2. **Given** a player has an "X" at the intersection of a horizontal and vertical line of length $N$, **When** the board is scored, **Then** the player receives points for BOTH the horizontal and the vertical line (the intersection mark is validly crossed).

---

### Edge Cases
- **100x100 Grid Scaling**: Ensure the browser does not freeze and that the board displays within scrollable containers instead of overflowing the page limits.
- **Board Filled (Draw)**: If all board cells are occupied and no player has met the $K$ target lines, the game must declare a tie/draw and offer option to restart or configure.
- **Simultaneous Lines (Combo)**: Placing a single mark that completes 2 or more lines at once. The game must calculate the correct scores and award combo bonus points (`COMBO_EXTRA_PER_LINE`).

## Requirements

### Functional Requirements

- **FR-101**: System MUST support configuring grid rows and columns from 3 to 100.
- **FR-102**: System MUST support configuring the winning line length $N$ (how many marks in a line are needed to score).
- **FR-103**: System MUST support configuring target lines $K$ (how many lines needed to win the game).
- **FR-104**: System MUST alternate turns between up to 4 players in standard local VS mode.
- **FR-105**: System MUST compute winning lines using a deterministic greedy algorithm:
  - No reuse of a cell for multiple lines in the SAME direction (Horizontal, Vertical, Diagonal Down-Right, Diagonal Down-Left).
  - Crossings of lines in DIFFERENT directions are fully permitted and scored independently.
- **FR-106**: System MUST allocate points as follows:
  - 1 point per mark placement (`MOVE_POINTS`).
  - 6 points per completed line (`LINE_POINTS`).
  - 4 additional points per line completed in a single turn beyond the first (`COMBO_EXTRA_PER_LINE`).
- **FR-107**: System MUST render strike-lines over all validated scoring alignments.
- **FR-108**: System MUST synthesize all sound effects dynamically using the Web Audio API without requiring external audio files.

### Key Entities
- **Board Configuration**: Represents rows, cols, winLength, targetLines, and numPlayers.
- **Board State**: An array of size $Rows \times Cols$, containing player symbols or `null` for empty cells.
- **Player**: Represents a participant with their name, symbol (e.g. X, O, △, @), active color class, and current scores (both placements and lines).

## Success Criteria

### Measurable Outcomes
- **SC-101**: Grid creation for any size up to 50x50 happens within 200ms of clicking "Iniciar Juego".
- **SC-102**: Sound generation latency is less than 50ms from mouse click.
- **SC-103**: All valid winning lines are correctly marked with visual SVG/HTML overlay strike-lines upon turn completion.
- **SC-104**: The page is fully responsive, fitting boards up to 100x100 in scrollable wrappers without breaking page container widths.

## Assumptions
- **A-101**: Players have a modern browser supporting CSS Grid, Flexbox, and Web Audio API.
- **A-102**: Mobile devices are supported via responsive scrolling, enabling gameplay on large grids by swiping.
- **A-103**: Session data is transient; reloading the page clears the active game and configuration.

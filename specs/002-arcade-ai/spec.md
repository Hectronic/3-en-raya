# Feature Specification: Arcade Mode and Boss AI Personalities

**Feature Branch**: `002-arcade-ai`

**Created**: 2026-06-28

**Status**: Baseline / Implemented

**Input**: Existing codebase analysis (`ai/` directory, profiles, and integration).

## User Scenarios & Testing

### User Story 1 - Single-Player Arcade Progression (Priority: P1)
As a single player, I want to play through an increasingly difficult series of AI opponents in Arcade Mode so that I can experience a progressive solo challenge.

**Why this priority**: It establishes the core single-player campaign, moving the player from one match to the next upon victory.

**Independent Test**: Play and win against Boss X in Arcade Mode; verify that the game shows an transition screen introduces the next boss (Boss O), and starts the next match on a different scenario layout.

**Acceptance Scenarios**:
1. **Given** the user selects "Arcade Mode" in the configuration screen, **When** they start the game, **Then** they are introduced to Boss X (Match 1) with an intro splash screen, custom audio theme, and avatar.
2. **Given** the player defeats Boss X, **When** the match ends, **Then** the game increments the global win counters, plays a victory transition, and displays the next boss (Boss O) introduction.
3. **Given** the player loses to any boss, **When** the match ends, **Then** the option to restart the current match is presented.

---

### User Story 2 - Distinct Boss Playstyles & Difficulties (Priority: P2)
As a player, I want each boss to play with a distinct strategy and personality so that the matches feel unique and represent different difficulty levels.

**Why this priority**: Crucial for replayability and depth; if all bosses played identically, progression would feel redundant.

**Independent Test**: Inspect moves made by Boss X (frequent random selections, ignores easy blocks) versus Boss Hash (performs deep tactical placements, blocks immediately, controls the center).

**Acceptance Scenarios**:
1. **Given** the player has an immediate winning alignment of length $N-1$, **When** playing against Boss O or higher, **Then** the CPU MUST prioritize selecting the blocking cell.
2. **Given** Boss O has its first turn and the center cell is empty, **When** calculating its move, **Then** it MUST immediately select the center cell.
3. **Given** Boss Hash is active, **When** it evaluates its move, **Then** it uses Minimax search depth of 2 to anticipate player counter-moves and maximize threat control.

---

### User Story 3 - Shared AI Utilities (Priority: P1)
As an AI personality developer, I want a shared library of game board analysis helpers so that I can implement new boss behaviors quickly without replicating board-scanning code.

**Why this priority**: Clean architecture and maintainability mandate; prevents bug replication across 5 separate script files.

**Independent Test**: Ensure all boss files (`boss-x.js`, `boss-o.js`, etc.) access the global `window.ArcadeAiUtils` namespace to perform moves, find lines, and calculate heuristic values.

**Acceptance Scenarios**:
1. **Given** any AI personality is executing, **When** evaluating potential moves, **Then** it delegates empty cell identification to `ArcadeAiUtils.getEmptyCells(board)`.
2. **Given** any AI personality wants to evaluate if a move forms an immediate win or block, **When** checking candidates, **Then** it invokes `ArcadeAiUtils.findImmediateLineMove(ctx, symbol)`.

---

### Edge Cases
- **Board Grid Size in Arcade Mode**: Arcade Mode maps specific matchups to custom scenarios:
  - Match 1 (Boss X): 3x3 Grid
  - Custom Scenarios for subsequent levels scale from 6x6 to 8x10.
- **Tie/Draw handling**: If a match against a boss ends in a draw, the player should be allowed to replay the match without losing their progression.
- **Browser Audio Restrictions**: Boss intro sounds and click tones must not throw errors if the browser blocks early Web Audio API actions. The audio context must resume on the first mouse click.

## Requirements

### Functional Requirements

- **FR-201**: System MUST provide an "Arcade Mode" option in the main configuration screen.
- **FR-202**: System MUST orchestrate a progression of 5 Bosses in the following order:
  1. **Boss X**: Easy. 20% block rate, relies heavily on heuristic random pick.
  2. **Boss O**: Medium-Easy. Prioritizes center cell, wins/blocks, scores moves on threats and adjacency.
  3. **Boss A (△)**: Medium. 1-move lookahead of threats, double threats, and center bias.
  4. **Boss AT (@)**: Hard. 2-ply worst-case reply analysis with threat evaluations.
  5. **Boss Hash (#)**: Hardest. Minimax search with Alpha-Beta pruning of depth 2.
- **FR-203**: System MUST load each AI personality from a separate JavaScript file inside `ai/personalities/`.
- **FR-204**: Personalities MUST register themselves under `window.ArcadeAiProfiles`.
- **FR-205**: System MUST provide helper utilities in `ai/arcade-ai-utils.js` including:
  - `getEmptyCells(board)`
  - `randomPick(list)`
  - `getCenterIndex(config)`
  - `applyMove(board, index, symbol)`
  - `scoreCenterBias(config, index)`
  - `getNeighbors(index, config)`
  - `countAdjacent(board, config, index, symbol)`
  - `findImmediateLineMove(ctx, player, candidates)`
  - `countImmediateLineMoves(ctx, boardState, player, candidates)`
  - `topCandidatesByHeuristic(ctx, board, candidates, limit)`
- **FR-206**: System MUST scale game parameters (rows, columns, target lines) as the player progresses through matches.
- **FR-207**: System MUST render unique transition screens showing the upcoming opponent's avatar, subtitle, and intro sound.

### Key Entities
- **AI Profile**: A function of signature `(ctx) => index` registered in the profiles dictionary.
- **Game Context (ctx)**: Object passed to AI profiles containing the board state, configuration, available candidate moves, AI/human symbols, and reference scoring functions.

## Success Criteria

### Measurable Outcomes
- **SC-201**: Switching to Arcade Mode correctly updates the UI to disable manual multi-player selections.
- **SC-202**: AI moves must compute within 150ms on any standard device, ensuring no visible lag or frame-drop during the computer's turn (especially for Boss Hash's minimax).
- **SC-203**: Boss intro transitions must display within 100ms of match advancement.

## Assumptions
- **A-201**: Each boss personality behaves deterministically or with controlled stochasticity (e.g. Boss X's 20% block check).
- **A-202**: Assets for boss close-ups and images exist under `images/characters/`.

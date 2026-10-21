# Implementation Plan: Arcade Mode and Boss AI Personalities

**Feature Branch**: `002-arcade-ai` | **Date**: 2026-06-28 | **Spec**: `specs/002-arcade-ai/spec.md`

## Summary
Document the modular, profile-based single-player Arcade Mode and the 5 AI Boss personalities. The system splits profiles into individual JavaScript scripts, unified via a global registry and a shared utility layer.

## Technical Context

**Language/Version**: ES6+ JavaScript, HTML5

**Primary Dependencies**: None (Pure standard Web APIs)

**Target Platform**: Evergreen web browsers.

**Project Type**: Single-player campaign expansion for frontend web app.

## Constitution Check
- **Modern Frontend Stack**: Checked. Completely vanilla, loads files via `<script>` tags, no bundling.
- **Extensible Boss AI Personalities**: Checked. Boss modules register dynamically to `window.ArcadeAiProfiles` and use pure-state context inputs.
- **Responsive Layout**: Checked. Handles transitions, cinematic split screens, and overlays seamlessly.

## Project Structure

### Source Code
```text
/home/developer/repos/hector/3-en-raya/
├── ai/
│   ├── arcade-ai-utils.js        # Shared AI utility library
│   └── personalities/
│       ├── boss-x.js             # Boss X (Easy)
│       ├── boss-o.js             # Boss O (Medium-Easy)
│       ├── boss-a.js             # Boss Triangle (Medium)
│       ├── boss-at.js            # Boss @ (Hard)
│       └── boss-hash.js          # Boss Hash (Hardest)
```

## AI Architecture & Algorithms

### 1. The Context Interface (`ctx`)
When the CPU needs to make a move, `script.js` invokes the registered function in `window.ArcadeAiProfiles[symbol](ctx)` passing:
- `board`: Snapshot of current board array.
- `config`: Active `{ rows, cols, winLength, targetLines }` parameters.
- `candidates`: Indices of all currently empty cells.
- `aiSymbol`: Character symbol of the active boss.
- `humanSymbol`: Character symbol of the player.
- `getLineCount(boardState, playerSymbol)`: Function returning the total lines formed by that player on that board state (greedy).

### 2. The Heuristic Utility (`ArcadeAiUtils`)
- `topCandidatesByHeuristic()`: Generates scores for potential moves:
  $$\text{Score} = (OwnAdjacent \times 1.6) + (EnemyAdjacent \times 0.9) + (CenterBias \times 0.35)$$
  And returns the top $M$ positions.
- `findImmediateLineMove()`: Fast lookup to see if a move immediately increases the line count (can be used for finding winning or blocking moves).

### 3. Minimax with Alpha-Beta Pruning (`boss-hash.js`)
Boss Hash uses full minimax to depth 2:
- **Heuristic State Evaluation**:
  $$\text{StateScore} = (AiLines - HumanLines) \times 18 + (AiThreats - HumanThreats) \times 10 + (CenterControl \times 0.25)$$
- **Pruning**: Leverages standard $\alpha$-$\beta$ pruning to skip unpromising branches on branch-limited candidate sets.

### 4. Interactive Progression Loop
- `ARCADE_BOSS_ORDER` defines the sequence of bosses: `['X', 'O', 'A', '@', '#']`.
- Win requirements scale dynamically per opponent (e.g. board size increases, target lines increase).
- Transition animations are driven by CSS state classes triggered via JS timing.

## Next Steps & Validation
As a baseline feature, no further source modifications are planned. Future custom personalities must adhere to the signature and utility boundaries defined here.

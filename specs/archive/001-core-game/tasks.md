# Tasks: Core Tic-Tac-Toe Game with Customizable Rules

**Input**: Design documents from `/specs/001-core-game/`

**Prerequisites**: plan.md (completed), spec.md (completed)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create project directories (HTML/CSS/JS baseline)
- [x] T002 Design main page layout structure (`index.html`)
- [x] T003 Configure responsive canvas/grid classes and variables in `style.css`

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Implement basic DOM event listeners and turn management in `script.js`
- [x] T005 Implement Web Audio API dynamic tone synthesis (`playTone()`)
- [x] T006 Implement core Board array structure and reset sequences

## Phase 3: User Story 1 - Local Multi-player Match with Preset Configuration

**Goal**: Enable alternating player turns, placing marks, and declaring wins on standard 3x3 boards.

- [x] T007 [US1] Create interactive grid rendering loop in `renderBoard()`
- [x] T008 [US1] Implement turn alternation and cell placement handlers
- [x] T009 [US1] Implement basic winning line lookup and validation
- [x] T010 [US1] Create SVG/HTML overlays for rendering winning line strikes on completion

## Phase 4: User Story 2 - Customizable Grid and Custom Rules

**Goal**: Support arbitrary board dimensions $R \times C$, alignment lengths $N$, and line counts $K$.

- [x] T011 [US2] Implement Custom Config inputs and validation fields in setup steps
- [x] T012 [US2] Refactor board rendering to dynamically compute CSS Grid columns/rows based on config
- [x] T013 [US2] Adapt game loop to handle multi-line objectives ($K > 1$) and cumulative scoring

## Phase 5: User Story 3 - Greedy Line-Counting Algorithm

**Goal**: Implement non-reusable same-direction greedy scanning with multi-directional crossing.

- [x] T014 [US3] Implement four-directional scanning loop in `calculateWinningLinesForPlayer()`
- [x] T015 [US3] Add directional reuse marker tracking to prevent double scoring same cells in same direction
- [x] T016 [US3] Add support for crossing lines (e.g., intersecting horizontal and vertical counts)
- [x] T017 [US3] Calculate combo bonus points (`COMBO_EXTRA_PER_LINE`) when multiple lines complete at once

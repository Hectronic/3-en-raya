# Tasks: Arcade Mode and Boss AI Personalities

**Input**: Design documents from `/specs/002-arcade-ai/`

**Prerequisites**: plan.md (completed), spec.md (completed)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create `ai/` folder structure
- [x] T002 Setup the `window.ArcadeAiProfiles` registry namespace
- [x] T003 Implement shared utilities in `ai/arcade-ai-utils.js`

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Implement neighborhood detection and center index helpers in `ArcadeAiUtils`
- [x] T005 Implement immediate win/block detector (`findImmediateLineMove`) in `ArcadeAiUtils`
- [x] T006 Implement candidate selection heuristics (`topCandidatesByHeuristic`) in `ArcadeAiUtils`

## Phase 3: User Story 1 - Single-Player Arcade Progression

**Goal**: Sequence five matches against progressive AI bosses on custom scenarios.

- [x] T007 [US1] Create Boss intro transitions, avatar nodes, and cinematic screens in HTML/CSS
- [x] T008 [US1] Implement match progression handler in `script.js`
- [x] T009 [US1] Map boss matchups to scaling grid sizes and line objectives (scenarios)
- [x] T010 [US1] Integrate success/failure screens with audio cues and restart buttons

## Phase 4: User Story 2 - Distinct Boss Playstyles & Difficulties

**Goal**: Implement individual boss move-selection algorithms with varying strategies.

- [x] T011 [US2] Implement Boss X: Easy heuristic with 20% block check (`ai/personalities/boss-x.js`)
- [x] T012 [US2] Implement Boss O: Medium-Easy center-grab and candidate evaluation (`ai/personalities/boss-o.js`)
- [x] T013 [US2] Implement Boss A: Medium 1-move threat lookahead (`ai/personalities/boss-a.js`)
- [x] T014 [US2] Implement Boss AT: Hard worst-case 2-ply reply evaluator (`ai/personalities/boss-at.js`)
- [x] T015 [US2] Implement Boss Hash: Hardest minimax with Alpha-Beta pruning (`ai/personalities/boss-hash.js`)

## Phase 5: User Story 3 - Shared AI Utilities

**Goal**: Restructure AI logic so personalities run on pure-state contexts and depend entirely on `ArcadeAiUtils`.

- [x] T016 [US3] Wrap game state into a unified `ctx` object before invoking any AI profile function
- [x] T017 [US3] Standardize AI profiles to consume only state parameters and return selected move index

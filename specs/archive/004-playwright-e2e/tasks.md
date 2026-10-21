# Tasks: End-to-End Automated Testing with Playwright

**Input**: Design documents from `/specs/004-playwright-e2e/`

**Prerequisites**: plan.md (completed), spec.md (completed)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Initialize Node.js `package.json` manifest
- [x] T002 Install `@playwright/test` dev dependency silently
- [x] T003 Install Playwright Chromium browser binary dependencies

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Create Playwright browser configurations in `playwright.config.js`
- [x] T005 Register `npm test` script execution script inside `package.json`

## Phase 3: User Story 1 - Configuration Step Navigation Tests

**Goal**: Verify that users can traverse configuration steps without breaking menus.

- [x] T006 [US1] Write config step traversal test in `tests/game.spec.js`
- [x] T007 [US1] Assert correct player-increment/decrement carousels behavior
- [x] T008 [US1] Verify back navigation buttons correctly restore previous views

## Phase 4: User Story 2 - Complete Gameplay Simulation

**Goal**: Headlessly simulate local 2-player VS matches.

- [x] T009 [US2] Write multi-player match placement test in `tests/game.spec.js`
- [x] T010 [US2] Verify turn markers alternate on success and are locked on occupied cells
- [x] T011 [US2] Test board resetting restores pristine cells

## Phase 5: User Story 3 - Validate Responsive Layout and Mobile Boundaries

**Goal**: Automatically verify viewport responsive alignments and board scrolling.

- [x] T012 [US3] Write mobile viewport test in `tests/game.spec.js`
- [x] T013 [US3] Verify `.board-wrapper` display boundaries and overflow scrolling
- [x] T014 [US3] Integrate Arcade Mode AI battle execution test (Match 1 vs Boss X)

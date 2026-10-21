# Tasks: Mobile and Tablet Responsive UX Improvements

**Input**: Design documents from `/specs/003-mobile-responsive/`

**Prerequisites**: plan.md (completed), spec.md (completed)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create `specs/003-mobile-responsive` feature specs and layout

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T002 Wrap `#game-board` with `<div class="board-wrapper">` inside `index.html`
- [x] T003 Implement `.board-wrapper` centering and independent scroll bounds in `style.css`

## Phase 3: User Story 1 - Prevent Screen Clipping on Mobile Browsers

**Goal**: Support vertical scroll on setup steps and dynamic heights (`100dvh`).

- [x] T004 [US1] Update `.container` in `style.css` to fallback on dynamic viewport height `100dvh`
- [x] T005 [US1] Implement vertical scrolling overflow with inertia on `#config-panel` in `style.css`

## Phase 4: User Story 2 - Playable Board Cells with Fat-Finger Prevention

**Goal**: Clamp mobile/tablet grid cell size to a minimum of 36px.

- [x] T006 [US2] Update `renderBoard()` in `script.js` to enforce `36px` minimum size on mobile/tablets
- [x] T007 [US2] Set board wrapper box sizing and touch action styles to optimize tap responsiveness

## Phase 5: User Story 3 - Compact Scrollable Preset Grid

**Goal**: Organize card grids compactly on small viewports and isolate vertical scroll.

- [x] T008 [US3] Configure `.board-grid` to display in 2 columns on mobile viewports (<640px)
- [x] T009 [US3] Constrain `.board-grid` to a sub-scrolled `max-height: 240px` area to preserve action button visibility

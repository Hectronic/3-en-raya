# Feature Specification: Mobile and Tablet Responsive UX Improvements

**Feature Branch**: `003-mobile-responsive`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User request: "mejorar su adaptacion a moviles y tablets"

## User Scenarios & Testing

### User Story 1 - Prevent Screen Clipping on Mobile Browsers (Priority: P1)
As a mobile phone player, I want the game menus to fit within my viewport without being cut off by the browser navigation bars, so that I can configure and play without losing access to crucial buttons.

**Why this priority**: Crucial for accessibility; currently, the fixed height can push action buttons completely off-screen on smaller devices.

**Independent Test**: Resize the window to mobile sizes (e.g. 360x640) or test on a mobile browser, and verify that all configuration steps and buttons are visible and that setup screens can be scrolled vertically if needed.

**Acceptance Scenarios**:
1. **Given** a mobile phone screen, **When** any setup step contains overflowing content, **Then** the user can scroll vertically to access all controls and the "Continuar" / "Jugar" buttons.
2. **Given** a modern browser, **When** calculating container heights, **Then** the system uses Dynamic Viewport Height (`dvh`) units to adapt to showing/hiding browser address bars.

---

### User Story 2 - Playable Board Cells with Fat-Finger Prevention (Priority: P1)
As a touch-screen player, I want board cells to stay large enough to tap easily (minimum 36px) even on large grids, so that I don't make accidental moves due to tiny, microscopically small cells.

**Why this priority**: Key usability factor; shrinking cells down to 12px makes gameplay impossible and frustrating on touchscreens.

**Independent Test**: Configure a 10x10 board on mobile, verify that cells are at least 36px wide and tall, and that the board stage can be scrolled smoothly to navigate the whole grid.

**Acceptance Scenarios**:
1. **Given** a board of large size (e.g., 8x10) on mobile, **When** the board is rendered, **Then** cell size is clamped to a minimum of 36px.
2. **Given** the board size exceeds the visible screen boundaries, **When** rendered, **Then** the board is enclosed in a scrollable wrapper, allowing horizontal and vertical panning.

---

### User Story 3 - Compact Scrollable Preset Grid (Priority: P2)
As a tablet or mobile player, I want the list of board presets to be compact and self-contained, so that I don't have to scroll through a massive vertical list of 13 cards just to find the start button.

**Why this priority**: Improves configuration layout and keeps primary navigation buttons fixed/visible on the screen.

**Independent Test**: Go to Step 3 (Escenario) on mobile; verify that the preset cards are displayed in 2 columns (instead of 1 column), and that they scroll within a fixed-height sub-grid with "Atras" and "Jugar" buttons remaining in view.

**Acceptance Scenarios**:
1. **Given** the Board Preset step is active on mobile, **When** rendered, **Then** preset cards display in a 2-column grid.
2. **Given** there are more presets than can fit, **When** viewed on mobile, **Then** the cards scroll vertically within the `#board-grid` wrapper while action buttons stay fixed at the bottom.

---

### Edge Cases
- **Zooming/Double-tap**: Browsers sometimes zoom when cells are double-tapped; touch-action must be set to `manipulation` to disable default double-tap gestures.
- **Landscape Mode**: On phone landscape, vertical space is extremely limited (<320px). The UI must adapt by reducing padding and scaling down titles.

## Requirements

### Functional Requirements

- **FR-301**: System MUST use `100dvh` (with `100vh` fallback) for `.container` to correctly account for mobile browser UI headers/footers.
- **FR-303**: System MUST wrap the `#game-board` element in a `.board-wrapper` div inside `index.html` to support self-contained scrolling.
- **FR-304**: System MUST allow the game board to scroll horizontally and vertically within `.board-wrapper` when it exceeds visible boundaries.
- **FR-305**: System MUST enforce a minimum cell size of `36px` on mobile/tablets (`window.innerWidth <= 820`) to prevent fat-finger issues.
- **FR-306**: System MUST update `.board-grid` to a 2-column layout on mobile devices (`max-width: 640px`) instead of 1 column.
- **FR-307**: System MUST constrain `#board-grid` to a scrollable container with `max-height` (e.g. `260px` on mobile) to ensure navigation buttons stay fixed and visible.
- **FR-308**: System MUST apply `overflow-y: auto` and `-webkit-overflow-scrolling: touch` to `#config-panel` to ensure full vertical scrollability.
- **FR-309**: System MUST filter board presets dynamically based on viewport width:
  - Hide large square layout presets (TITAN, COLOSO, OVERDRIVE) on mobile viewports (`window.innerWidth <= 820`).
  - Hide mobile-optimized vertical/horizontal presets (MOBILE DASH, MOBILE RUSH, etc.) on desktop viewports.
  - Always show general presets (CLASICO, ARENA, MEGA) and CUSTOM configurations across all devices.
- **FR-310**: System MUST dynamically apply a compact, horizontal row-based score layout (`.compact-scores`) when there are more than 2 players active, or on mobile/tablet viewports, to maximize vertical space for the active board.

### Key Entities
- **Board Wrapper (`.board-wrapper`)**: Flex container wrapping the board, centering smaller boards and scroll-managing larger boards.

## Success Criteria

### Measurable Outcomes
- **SC-301**: No part of the UI is pushed permanently off-screen or rendered unclickable on a standard 360x640 mobile viewport.
- **SC-302**: Touch targets (board cells) are at least `36px` $\times$ `36px` on mobile, providing adequate tap area.
- **SC-303**: Selecting a preset is complete within 2 taps without scrolling more than 1 viewport.

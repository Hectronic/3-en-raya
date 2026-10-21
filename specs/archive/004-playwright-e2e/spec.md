# Feature Specification: End-to-End Automated Testing with Playwright

**Feature Branch**: `004-playwright-e2e`

**Created**: 2026-06-28

**Status**: Baseline / Implemented

**Input**: User request: "aumenta el numero de test y añade test 2e2 en playwright"

## User Scenarios & Testing

### User Story 1 - Run Configuration Step Navigation Tests (Priority: P1)
As a developer, I want to automatically test that users can navigate forward and backward through the 4 steps of setup without breaking active configuration states, so that I can prevent UI regressions.

**Why this priority**: Essential to guarantee configuration integrity. If users cannot configure their matches, they cannot play.

**Independent Test**: Execute the `should navigate through the configuration steps successfully in VS mode` test and verify that it traverses steps 1-2-3 and backs out successfully.

**Acceptance Scenarios**:
1. **Given** the user is in VS mode, **When** they click "Continuar", **Then** the player setup is displayed.
2. **Given** the user alters player count or symbols, **When** they navigate back and forward, **Then** their customized inputs remain persisted.

---

### User Story 2 - Run Complete Gameplay Simulation (Priority: P1)
As a QA engineer, I want to run a headless browser simulation of two local players alternating clicks, placing marks, and validating that occupied cells are protected, so that I can automatically ensure core match integrity.

**Why this priority**: Core value of the application; a breakdown in placing marks or alternating turns completely ruins the gameplay loop.

**Independent Test**: Run the local VS match simulation test to verify correct turn-based placements of "X" and "O" marks.

**Acceptance Scenarios**:
1. **Given** a new 3x3 game has started, **When** alternating clicks are made on cells 4 and 0, **Then** an "X" is placed on 4, an "O" is placed on 0, and the turn displays update correctly.
2. **Given** an occupied cell, **When** it is clicked again, **Then** the board state does not change, and the active turn is preserved.

---

### User Story 3 - Validate Responsive Layout and Mobile Boundaries (Priority: P2)
As a designer, I want to automatically verify that mobile viewports wrap the board in a scrollable, non-clipping boundary, so that no layout is broken on narrow displays.

**Why this priority**: Confirms that our responsive UX adjustments (clamping cell size to 36px) do not bleed out of visible viewports.

**Independent Test**: Launch the mobile viewport test and verify that `.board-wrapper` uses `overflow: auto` CSS rules.

**Acceptance Scenarios**:
1. **Given** a 375x667 viewport, **When** a match is started, **Then** the board is enclosed in a visible scroll-wrap element.

---

## Requirements

### Functional Requirements

- **FR-401**: System MUST provide a Playwright configuration file `playwright.config.js` in the repository root.
- **FR-402**: System MUST host tests inside the `tests/` directory with `.spec.js` extensions.
- **FR-403**: System MUST define a `package.json` with an automated `npm test` script to run Playwright tests in headless mode.
- **FR-404**: System MUST verify:
  - Configuration traversal and state persistence.
  - Interactive multi-player VS matches (cell marking, alternation, protection, and resetting).
  - Responsive container layout checks under narrow widths.
  - Arcade Mode CPU opponent (Boss X) automated response plays.

## Success Criteria

### Measurable Outcomes
- **SC-401**: Automated E2E test suite executes and delivers complete diagnostic logs in less than 15 seconds.
- **SC-402**: Tests execute headlessly on chromium with no local HTTP server dependencies, using direct file protocols (`file://`).
- **SC-403**: E2E test suite passes 100% on clean checkouts.

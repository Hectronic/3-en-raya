# Implementation Plan: End-to-End Automated Testing with Playwright

**Feature Branch**: `004-playwright-e2e` | **Date**: 2026-06-28 | **Spec**: `specs/004-playwright-e2e/spec.md`

## Summary
Document the E2E automated test architecture. The tests run headlessly on Playwright over standard Chromium, navigating and interacting with our static `index.html` via the local `file://` protocol.

## Technical Context

**Language/Version**: JavaScript (CommonJS), Node.js v20.19.3

**Primary Dependencies**: `@playwright/test` (v1.x)

**Target Platform**: Headless Desktop Chromium and Mobile Simulated Viewports.

## Constitution Check
- **Modern Frontend Stack**: Checked. The testing stack verifies that the vanilla app behaves correctly across multiple steps, DOM actions, and responsive media query breakpoints.
- **Responsive Layout**: Checked. The tests explicitly resize the viewport and verify that our dynamic `.board-wrapper` scroll configurations are active in the stylesheet.
- **Extensible Boss AI**: Checked. The tests launch Arcade Mode, perform an active click, and verify that the computer Boss responds by placing its own mark on the board.

## Project Structure

```text
/home/developer/repos/hector/3-en-raya/
├── playwright.config.js    # Playwright configuration, runners, and viewports
├── package.json            # Node.js project manifest and test run scripts
└── tests/
    └── game.spec.js        # Comprehensive test scenarios
```

## Implementation & Test Specifications

### 1. File Protocol Testing
To ensure the tests are fast and run without starting local HTTP servers:
- Paths are resolved dynamically: `file://${path.resolve(__dirname, '../index.html')}`.
- All static assets (JS profiles, icons, stylesheet) are loaded via the browser's native file loader.

### 2. Scenario Coverages
- **Traversal test**: Navigates `Mode -> Players (changes counts) -> Board -> Back to Mode`.
- **VS gameplay test**: Checks click placements, verifies alternating symbols (X and O), locks occupied cells, and tests resets.
- **Mobile view test**: Adjusts viewport to 375x667, verifies the `.board-wrapper` visibility and overflow rules.
- **Arcade Battle test**: Chooses Arcade mode, clicks a cell, waits 600ms, and asserts that the CPU placed its mark (evaluates board length increment to $\ge 2$).

## Validation & Execution
- **Command**: `npm test`
- **Output**: Multi-test execution reports, verifying all test states pass headlessly.

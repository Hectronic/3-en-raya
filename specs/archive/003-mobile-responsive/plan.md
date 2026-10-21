# Implementation Plan: Mobile and Tablet Responsive UX Improvements

**Feature Branch**: `003-mobile-responsive` | **Date**: 2026-06-28 | **Spec**: `specs/003-mobile-responsive/spec.md`

## Summary
Refactor the CSS styles and HTML wrappers to support robust touch interaction and prevent viewport clipping on mobile/tablet platforms. Ensure comfortable cell tap sizes (min 36px) and add clean scroll wrappers for high-dimension boards.

## Technical Context

**Language/Version**: CSS3, HTML5, Vanilla JavaScript (ES6+)

**Target Platform**: Mobile and Tablet Safari, Chrome, Firefox, and desktop fallback sizes.

## Constitution Check
- **Modern Frontend Stack**: Checked. Completely vanilla, leveraging standard media queries and dynamic CSS.
- **Responsive Layout**: Checked. Incorporates `100dvh` and scrollable bounds to achieve seamless responsiveness.
- **Web Audio API & Visuals**: Checked. Ensures touch-action values prevent default zoom/delay on taps.

## Project Structure

### File Modifications
- **`index.html`**: Introduce a `<div class="board-wrapper">` element inside `.board-stage` to wrap `#game-board`.
- **`style.css`**: Add styling for `.board-wrapper`, update `.container` and `#config-panel` for height/scroll resilience, and make `#board-grid` compact and scrollable.
- **`script.js`**: Enforce a minimum cell size of `36px` on mobile/tablets inside `renderBoard()`.

## Architectural Design

### 1. Board Centering & Scrolling
The `#game-board` will be wrapped in a `.board-wrapper` flex container:
* **Centering**: When the board size is smaller than the available space, `.board-wrapper` uses `justify-content: center; align-items: center;` to keep the grid perfectly centered.
* **Scrolling**: When the grid size exceeds the available screen (due to a minimum cell size clamp of 36px or high row/col settings), the wrapper automatically scrolls with `overflow: auto`.

### 2. Squeeze-Prevention in Setup Menus
To prevent components from clipping or overlapping on vertical-space-constrained devices:
* `#config-panel` gets `overflow-y: auto; -webkit-overflow-scrolling: touch;`.
* The board preset card grid (`#board-grid`) becomes a 2-column layout on mobile, constrained to a max-height of 280px with vertical sub-scrolling. This guarantees the setup step action buttons remain visible and clickable on all phone viewports.

## Implementation Steps

### Step 1: Wrap Board in HTML
Update `index.html` around line 183 to wrap `#game-board` inside `<div class="board-wrapper">`.

### Step 2: Update Stylesheet
Apply style adjustments in `style.css`:
1. Add `.board-wrapper` declaration.
2. Update `.container` to utilize dynamic viewport height (`100dvh`).
3. Set `#config-panel` to scroll vertically when needed.
4. Set `.board-grid` to a 2-column scrollable grid under `max-width: 640px`.

### Step 3: Enforce Min Cell Size in JS
Modify `script.js`'s `renderBoard()` to clamp the minimum cell size to `36px` when the screen width is under `820px`.

## Validation Plan
- **Responsiveness Check**: Verify layout on simulated viewports (360x640, 768x1024, 1024x1366) in browser emulator.
- **Tappability Validation**: Confirm board cells remain easily clickable and the board can be scrolled horizontally/vertically.
- **Presets Scrolling Check**: Verify that the "Escenario" step presets are neatly grouped and do not push action buttons off-screen.

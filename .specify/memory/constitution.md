<!--
Sync Impact Report
- Version change: Template → 1.0.0
- List of modified principles:
  * PRINCIPLE_1_NAME → Modern Frontend Stack
  * PRINCIPLE_2_NAME → Greedy Line-Counting Engine
  * PRINCIPLE_3_NAME → Extensible Boss AI Personalities
  * PRINCIPLE_4_NAME → Responsive Layout for Dynamic Boards
  * PRINCIPLE_5_NAME → Web Audio API & Interactive Feedback
- Added sections: Core Mechanics & Scoring rules
- Removed sections: None
- Templates requiring updates: None (aligned)
- Follow-up TODOs: None
-->

# 3-en-Raya Personalizable Constitution

## Core Principles

### I. Modern Frontend Stack
The codebase MUST use vanilla web technologies only: HTML5, CSS3, and modern standard ES6+ JavaScript. No build steps, complex frameworks (e.g., React, Vue), or heavy CSS utility libraries (e.g., TailwindCSS) are allowed unless explicitly requested. This guarantees lightweight execution, ease of deployment, and offline-first availability.

### II. Greedy Line-Counting Engine
The board evaluation logic MUST be fully deterministic, applying a strict "greedy" approach to count lines. Cells forming a winning line of length $N$ in a given direction (horizontal, vertical, or diagonal) cannot be reused for another line in that exact same direction. However, cells CAN be crossed (i.e., a single cell can contribute to both a horizontal and vertical line). The score calculation must be accurate and thoroughly verified.

### III. Extensible Boss AI Personalities
All single-player CPU players (Bosses) MUST be modular, self-contained, and defined under `ai/personalities/`. They must leverage shared game state analysis helper functions inside `ai/arcade-ai-utils.js` rather than repeating logic. Each boss personality should remain deterministic or semi-deterministic, providing varying playstyles and difficulty levels without external dependencies.

### IV. Responsive Layout for Dynamic Boards
The user interface MUST adapt smoothly to any configured board dimension from 3x3 up to 100x100 cells. The layout must rely on CSS Grid and Flexbox, wrapping excessively large boards in modern scroll/overflow containers to preserve accessibility and usability across desktop and mobile browsers.

### V. Web Audio API & Interactive Feedback
Audio feedback and visual effects (such as line-strike micro-animations, screen shakes, and color transitions) must be synthesized dynamically using the browser's Web Audio API and standard CSS keyframes. Do not load external MP3/WAV assets unless specified. All audio contexts must handle browser gesture requirements gracefully.

## Core Mechanics & Scoring Rules

### Player Progression & Scoring
- **Placement**: Placing a mark on the grid awards `MOVE_POINTS` (1 point).
- **Line Formation**: Aligning $N$ consecutive marks awards `LINE_POINTS` (6 points).
- **Combos**: Completing multiple lines simultaneously awards `COMBO_EXTRA_PER_LINE` (4 points) for each additional line beyond the first.
- **Victory Condition**: In standard modes with target lines $K > 1$, the first player to reach the required cumulative score/lines wins. For $K = 1$, the first player to align $N$ marks wins immediately.

## Development Workflow & Quality Gates

1. **Deterministic Logic Checks**: Any modification to the winning line detection algorithm must be validated against corner cases (e.g., 6 consecutive marks counting as exactly 2 lines of 3, but 4 consecutive marks counting as only 1 line of 3).
2. **AI Personality Isolation**: New bosses or boss behaviors must not affect the gameplay logic of existing bosses or standard local matches.
3. **No Warning Suppression**: Linting warnings, script errors, or console logs of unhandled exceptions are prohibited.

## Governance
This Constitution is the source of truth for all technical design and implementation decisions. Any changes to core principles require a documented rationale, a version increment (Major for breaking changes to principles/scoring, Minor for additions, Patch for clarifications), and immediate alignment of all templates.

**Version**: 1.0.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28

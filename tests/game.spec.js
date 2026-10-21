const { test, expect } = require('@playwright/test');
const path = require('path');

const gameUrl = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('Tic-Tac-Toe Customizable - E2E Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the local index.html file
    await page.goto(gameUrl);
  });

  test('should navigate through the configuration steps successfully in VS mode', async ({ page }) => {
    // Step 1: Mode Select (VS should be active by default)
    await expect(page.locator('#step-mode')).toBeVisible();
    await expect(page.locator('#mode-vs')).toHaveClass(/active/);
    
    // Continue to Players setup
    await page.click('#continue-to-players');
    await expect(page.locator('#step-mode')).not.toBeVisible();
    await expect(page.locator('#step-players')).toBeVisible();

    // Verify player count is 2 by default
    await expect(page.locator('#num-players-display')).toHaveText('2');

    // Increase players to 3, then decrease back to 2 to keep presets visible
    await page.click('#players-next');
    await expect(page.locator('#num-players-display')).toHaveText('3');
    await page.click('#players-prev');
    await expect(page.locator('#num-players-display')).toHaveText('2');

    // Go to Board setup step
    await page.click('#continue-to-boards');
    await expect(page.locator('#step-players')).not.toBeVisible();
    await expect(page.locator('#step-boards')).toBeVisible();

    // Verify some board preset card is active
    const activeCard = page.locator('.board-card.active');
    await expect(activeCard).toBeVisible();

    // Click config back buttons
    await page.click('#back-to-players');
    await expect(page.locator('#step-players')).toBeVisible();
    await page.click('#back-to-mode');
    await expect(page.locator('#step-mode')).toBeVisible();
  });

  test('should play a 2-player local VS match successfully', async ({ page }) => {
    // Navigate and start game on 3x3 Classic
    await page.click('#continue-to-players');
    await page.click('#continue-to-boards');
    await page.click('#start-btn');

    // Game area must become visible and config panel hidden
    await expect(page.locator('#config-panel')).not.toBeVisible();
    await expect(page.locator('#game-area')).toBeVisible();
    await expect(page.locator('#turn-display')).toContainText('Turno: X');

    // Retrieve cells
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(9);

    // Move 1: Player 1 (X) clicks center (index 4)
    await cells.nth(4).click();
    await expect(cells.nth(4)).toHaveClass(/cell x/);
    await expect(cells.nth(4)).toHaveText('X');

    // Turn should change to Player 2 (O)
    await expect(page.locator('#turn-display')).toContainText('Turno: O');

    // Move 2: Player 2 (O) clicks top-left (index 0)
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveClass(/cell o/);
    await expect(cells.nth(0)).toHaveText('O');

    // Move 3: Player 1 (X) clicks top-middle (index 1)
    await cells.nth(1).click();
    await expect(cells.nth(1)).toHaveText('X');

    // Move 4: Player 2 (O) clicks middle-left (index 3)
    await cells.nth(3).click();
    await expect(cells.nth(3)).toHaveText('O');

    // Clicking an occupied cell should not alter turn or value
    await cells.nth(4).click(); // Center is already 'X'
    await expect(page.locator('#turn-display')).toContainText('Turno: X');

    // Resetting the board should clear the board
    await page.click('#reset-btn');
    await expect(page.locator('#turn-display')).toContainText('Turno: X');
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toHaveText('');
    }
  });

  test('should show the result modal at the end of a match and allow playing again', async ({ page }) => {
    // Navigate and start game on 3x3 Classic
    await page.click('#continue-to-players');
    await page.click('#continue-to-boards');
    await page.click('#start-btn');

    // Retrieve cells
    const cells = page.locator('.cell');

    // Perform winning moves for Player 1 (X)
    // Row 0: 0, 1, 2
    // Row 1: 3, 4 (O moves)
    await cells.nth(0).click(); // X
    await cells.nth(3).click(); // O
    await cells.nth(1).click(); // X
    await cells.nth(4).click(); // O
    await cells.nth(2).click(); // X - Win!

    // Verify modal is shown after delay
    const modal = page.locator('#game-over-modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('¡VICTORIA!');
    await expect(page.locator('#modal-subtitle')).toContainText('ha ganado la partida');

    // Click restart button
    await page.click('#modal-restart-btn');

    // Modal should be hidden and game active again
    await expect(modal).not.toBeVisible();
    await expect(page.locator('#turn-display')).toContainText('Turno: X');
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toHaveText('');
    }
  });

  test('should verify responsive structural boundaries and board wrapper on mobile viewports', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Open boards step and start game
    await page.click('#continue-to-players');
    await page.click('#continue-to-boards');
    await page.click('#start-btn');

    // Verify the board wrapper container wraps the game board and supports overflow scroll
    const wrapper = page.locator('.board-wrapper');
    await expect(wrapper).toBeVisible();
    await expect(wrapper).toHaveCSS('overflow', 'auto');

    const board = page.locator('#game-board');
    await expect(board).toBeVisible();

    // Verify the score panels are compact on mobile (less than 100px height) and do not stretch excessively
    const leftScorePanel = page.locator('#left-score-panel');
    await expect(leftScorePanel).toBeVisible();
    const panelHeight = await leftScorePanel.evaluate(el => el.getBoundingClientRect().height);
    expect(panelHeight).toBeLessThan(100);
  });

  test('should launch Arcade Mode and play a match against Boss X', async ({ page }) => {
    // Select Arcade Mode in Step 1
    await page.click('#mode-arcade');
    await expect(page.locator('#mode-arcade')).toHaveClass(/active/);

    // Continue to Step 2
    await page.click('#continue-to-players');
    await expect(page.locator('#step-players')).toBeVisible();

    // Verify that player symbols container only shows exactly 1 row (the player, since CPU is auto-defined)
    const symbolRows = page.locator('#player-symbols .player-symbol-row');
    await expect(symbolRows).toHaveCount(1);
    await expect(symbolRows.first()).toContainText('Jugador 1');

    // Continue to start the arcade run
    await page.click('#continue-to-boards');

    // Wait for the game screen to become visible
    await expect(page.locator('#game-area')).toBeVisible();

    // Player (X) places first mark at middle cell
    const cells = page.locator('.cell');
    await cells.nth(4).click();
    await expect(cells.nth(4)).toHaveText('X');

    // Wait a brief moment to allow AI Boss X to calculate and make its move
    await page.waitForTimeout(600);

    // At least one other cell should have been selected by the CPU
    const boardTexts = await cells.allTextContents();
    const filledCells = boardTexts.filter(text => text !== '').length;
    expect(filledCells).toBeGreaterThanOrEqual(2); // Player move + CPU move
  });

  test('should filter board presets based on the device viewport width', async ({ page }) => {
    // 1. Desktop mode view
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(gameUrl);
    await page.click('#continue-to-players');
    await page.click('#continue-to-boards');

    // Desktop mode should show TITAN (desktop) and hide MOBILE DASH (mobile)
    const titanCard = page.locator('.board-card:has-text("TITAN")');
    const mobileDashCard = page.locator('.board-card:has-text("MOBILE DASH")');
    await expect(titanCard).not.toHaveClass(/hidden/);
    await expect(mobileDashCard).toHaveClass(/hidden/);

    // 2. Mobile mode view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(gameUrl);
    await page.click('#continue-to-players');
    await page.click('#continue-to-boards');

    // Mobile mode should show MOBILE DASH (mobile) and hide TITAN (desktop)
    await expect(titanCard).toHaveClass(/hidden/);
    await expect(mobileDashCard).not.toHaveClass(/hidden/);
  });

  test('should verify step 3 layout on mobile has no double scroll and buttons stay at the bottom', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(gameUrl);

    // Go to step 3
    await page.click('#continue-to-players');
    await page.click('#continue-to-boards');

    const stepBoards = page.locator('#step-boards');
    await expect(stepBoards).toBeVisible();

    // Verify step-boards has display: flex
    await expect(stepBoards).toHaveCSS('display', 'flex');
    await expect(stepBoards).toHaveCSS('flex-direction', 'column');

    // Verify board-grid is scrollable internally and has flex-grow
    const boardGrid = page.locator('#board-grid');
    await expect(boardGrid).toHaveCSS('overflow-y', 'auto');
    
    // Verify that the setup action buttons are visible
    const setupActions = page.locator('#step-boards .setup-actions');
    await expect(setupActions).toBeVisible();
    await expect(setupActions).toBeInViewport();
  });

  test('should bind styling and color to chosen character instead of player index', async ({ page }) => {
    // Go to player setup step
    await page.click('#continue-to-players');
    await expect(page.locator('#step-players')).toBeVisible();

    // Player 1 (index 0) has 'X' by default. Click next to change.
    // Since 'O' is already taken by Player 2, Player 1 skips to 'A' (class 't' / green)
    await page.locator('[aria-label="Ficha siguiente jugador 1"]').click();
    
    // Go to boards and start game
    await page.click('#continue-to-boards');
    await page.click('#start-btn');

    // Make a move with Player 1 (now 'A') at center cell (index 4)
    const cells = page.locator('.cell');
    await cells.nth(4).click();

    // The cell should have class 't' (green) instead of 'x' (cyan) even though it was played by Player 1
    await expect(cells.nth(4)).toHaveClass(/cell t/);
  });

  test('should verify all character symbols are correctly color-coded inside the setup carousel', async ({ page }) => {
    // Go to Step 2: Player Setup
    await page.click('#continue-to-players');
    await expect(page.locator('#step-players')).toBeVisible();

    // Mapping of characters to their expected CSS classes
    const characterMapping = [
      { name: 'X', expectedClass: 'x' },
      { name: 'A', expectedClass: 't' },
      { name: '@', expectedClass: 'o' },
      { name: '#', expectedClass: 'h' }
    ];

    const symbolDisplay = page.locator('#player-symbols .player-symbol-row:first-child .symbol-display');
    const nextBtn = page.locator('[aria-label="Ficha siguiente jugador 1"]');

    // Default character is 'X' (expectedClass: 'x')
    await expect(symbolDisplay).toHaveClass(/x/);

    // Verify subsequent characters get correct styling
    for (const char of characterMapping.slice(1)) {
      await nextBtn.click();
      await expect(symbolDisplay).toHaveClass(new RegExp(char.expectedClass));
    }
  });

  test('should verify character A (Triangle) has green theme across game UI components', async ({ page }) => {
    // Go to Step 2
    await page.click('#continue-to-players');
    await page.locator('[aria-label="Ficha siguiente jugador 1"]').click(); // Changes Player 1 to 'A' (Triangle)

    // Go to boards and start game
    await page.click('#continue-to-boards');
    await page.click('#start-btn');

    // Verify Player 1 Score Wrap Top has class 't'
    const leftScoreWrap = page.locator('#score-p0 .player-score-top');
    await expect(leftScoreWrap).toHaveClass(/t/);

    // Verify Turn Display is colored with Player 3 (green) color
    const turnDisplay = page.locator('#turn-display');
    await expect(turnDisplay).toHaveCSS('color', 'rgb(134, 255, 61)'); // rgb representation of #86ff3d

    // Click cell index 0
    const cells = page.locator('.cell');
    await cells.nth(0).click();

    // Verify cell gets class 't'
    await expect(cells.nth(0)).toHaveClass(/cell t/);
  });

});

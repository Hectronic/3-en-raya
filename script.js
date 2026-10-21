document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const configPanel = document.getElementById('config-panel');
    const gameArea = document.getElementById('game-area');
    const startBtn = document.getElementById('start-btn');
    const topGameActions = document.getElementById('top-game-actions');
    const resetBtn = document.getElementById('reset-btn');
    const configBtn = document.getElementById('config-btn');
    const homeBtn = document.getElementById('home-btn');
    const gameBoard = document.getElementById('game-board');
    const turnDisplay = document.getElementById('turn-display');
    const arcadeNextScreen = document.getElementById('arcade-next-screen');
    const nextScreenTitle = document.getElementById('next-screen-title');
    const nextScreenSubtitle = document.getElementById('next-screen-subtitle');
    const nextOpponentAvatar = document.getElementById('next-opponent-avatar');
    const nextOpponentFallback = document.getElementById('next-opponent-fallback');
    const leftScorePanel = document.getElementById('left-score-panel');
    const rightScorePanel = document.getElementById('right-score-panel');
    const leftScoreSlot = document.getElementById('left-score-slot');
    const rightScoreSlot = document.getElementById('right-score-slot');

    // Setup UI
    const playerSymbolsContainer = document.getElementById('player-symbols');
    const stepMode = document.getElementById('step-mode');
    const stepPlayers = document.getElementById('step-players');
    const stepBoards = document.getElementById('step-boards');
    const stepCustomBoard = document.getElementById('step-custom-board');
    const continueToPlayersBtn = document.getElementById('continue-to-players');
    const modeVsBtn = document.getElementById('mode-vs');
    const modeArcadeBtn = document.getElementById('mode-arcade');
    const playerSetupHead = document.querySelector('.player-setup-head');
    const playersPrevBtn = document.getElementById('players-prev');
    const playersNextBtn = document.getElementById('players-next');
    const numPlayersDisplay = document.getElementById('num-players-display');
    const continueToBoardsBtn = document.getElementById('continue-to-boards');
    const backToModeBtn = document.getElementById('back-to-mode');
    const backToPlayersBtn = document.getElementById('back-to-players');
    const backToBoardsBtn = document.getElementById('back-to-boards');
    const useCustomBoardBtn = document.getElementById('use-custom-board');
    const boardCards = Array.from(document.querySelectorAll('.board-card'));
    const customRowsInput = document.getElementById('custom-rows');
    const customColsInput = document.getElementById('custom-cols');
    const customTargetLinesInput = document.getElementById('custom-target-lines');

    // Modal End Game Elements
    const gameOverModal = document.getElementById('game-over-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalRestartBtn = document.getElementById('modal-restart-btn');
    const modalMenuBtn = document.getElementById('modal-menu-btn');

    // Game State
    let config = {
        rows: 3,
        cols: 3,
        winLength: 3,
        targetLines: 1,
        numPlayers: 2
    };
    
    const PLAYER_CLASSES = ['x', 'o', 't', 's'];
    const PLAYER_COLORS = ['var(--primary-color)', 'var(--secondary-color)', 'var(--player3-color)', 'var(--player4-color)'];
    
    const SYMBOL_CLASSES = {
        'X': 'x',
        'O': 'o',
        'A': 't',
        '@': 's',
        '#': 'h'
    };

    const SYMBOL_COLORS = {
        'X': 'var(--primary-color)',
        'O': 'var(--secondary-color)',
        'A': 'var(--player3-color)',
        '@': 'var(--player4-color)',
        '#': 'var(--boss-hash-color)'
    };

    function getClassForSymbol(symbol, playerIndex) {
        return SYMBOL_CLASSES[symbol] || PLAYER_CLASSES[playerIndex % PLAYER_CLASSES.length];
    }

    function getColorForSymbol(symbol, playerIndex) {
        return SYMBOL_COLORS[symbol] || PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
    }
    const CHARACTER_IMAGES = {
        X: 'images/characters/x.png',
        O: 'images/characters/o.png',
        A: 'images/characters/triangle.png',
        '@': 'images/characters/@4.png',
        '#': 'images/characters/hash.png'
    };
    const CHARACTER_CLOSEUP_IMAGES = {
        X: 'images/characters/x_close_up.png',
        O: 'images/characters/o_close_up.png',
        A: 'images/characters/triangle_close_up.png',
        '@': 'images/characters/@4_close_up.png',
        '#': 'images/characters/hash_close_up.png'
    };
    const DISPLAY_SYMBOLS = {
        A: '△'
    };
    const SYMBOL_POOL = Object.keys(CHARACTER_IMAGES);
    const ARCADE_BOSS_ORDER = ['X', 'O', 'A', '@', '#'];
    const ARCADE_ALT_TOKENS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let playerSymbols = ['X', 'O', 'A', '@'];
    let selectedGameMode = 'vs';
    let selectedPlayers = 2;
    let selectedBoard = { rows: 3, cols: 3, targetLines: 1 };
    let selectedBoardMode = 'preset';
    
    let board = [];
    let currentPlayerIndex = 0;
    let scores = {};
    let points = {};
    let allWinningLines = [];
    let gameActive = false;
    let audioCtx = null;
    let fxOverlay = null;
    const MOVE_POINTS = 1;
    const LINE_POINTS = 6;
    const COMBO_EXTRA_PER_LINE = 4;
    const ARCADE_SCENARIOS = [
        { rows: 6, cols: 6, targetLines: 5 },
        { rows: 7, cols: 8, targetLines: 7 },
        { rows: 8, cols: 10, targetLines: 9 }
    ];
    let arcadeOpponentSymbols = [];
    let arcadeOpponentIndex = 0;
    let arcadeSeriesPlayerWins = 0;
    let arcadeSeriesCpuWins = 0;
    let arcadeScenarioCursor = 0;
    let arcadeBossPlayerPoints = 0;
    let arcadeBossCpuPoints = 0;
    let arcadeGlobalPlayerWins = 0;
    let arcadeGlobalCpuWins = 0;

    // Event Listeners
    startBtn.addEventListener('click', initializeGame);
    resetBtn.addEventListener('click', resetBoard);
    configBtn.addEventListener('click', showConfig);
    homeBtn.addEventListener('click', showConfig);
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.id === 'mode-vs' || btn.id === 'mode-arcade') return;
        playUiClickSound();
    });
    modeVsBtn.addEventListener('click', () => {
        playUiSelectSound();
        selectedGameMode = 'vs';
        modeVsBtn.classList.add('active');
        modeArcadeBtn.classList.remove('active');
        renderPlayerSymbolSelectors();
        updatePlayersControlsForMode();
    });
    modeArcadeBtn.addEventListener('click', () => {
        playUiSelectSound();
        selectedGameMode = 'arcade';
        modeArcadeBtn.classList.add('active');
        modeVsBtn.classList.remove('active');
        selectedPlayers = 2;
        updatePlayersDisplay();
        renderPlayerSymbolSelectors();
        filterBoardCards();
        updatePlayersControlsForMode();
    });
    continueToPlayersBtn.addEventListener('click', () => showSetupStep(2));
    playersPrevBtn.addEventListener('click', () => shiftPlayers(-1));
    playersNextBtn.addEventListener('click', () => shiftPlayers(1));
    continueToBoardsBtn.addEventListener('click', () => {
        if (selectedGameMode === 'arcade') {
            startArcadeRun();
            return;
        }
        filterBoardCards();
        showSetupStep(3);
    });
    backToModeBtn.addEventListener('click', () => showSetupStep(1));
    backToPlayersBtn.addEventListener('click', () => showSetupStep(2));
    backToBoardsBtn.addEventListener('click', () => showSetupStep(3));
    useCustomBoardBtn.addEventListener('click', initializeGameFromCustomBoard);
    boardCards.forEach(card => {
        card.addEventListener('click', () => selectBoard(card));
    });
    const initialBoardCard = boardCards.find(card => card.classList.contains('active')) || boardCards[0];
    if (initialBoardCard) selectBoard(initialBoardCard);
    updatePlayersDisplay();
    renderPlayerSymbolSelectors();
    updatePlayersControlsForMode();
    showSetupStep(1);
    filterBoardCards();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        if (!gameArea.classList.contains('hidden')) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(renderBoard, 120);
        }
    });

    function showSetupStep(step) {
        stepMode.classList.toggle('hidden', step !== 1);
        stepPlayers.classList.toggle('hidden', step !== 2);
        stepBoards.classList.toggle('hidden', step !== 3);
        stepCustomBoard.classList.toggle('hidden', step !== 4);
    }

    function updatePlayersDisplay() {
        numPlayersDisplay.textContent = String(selectedPlayers);
    }

    function updatePlayersControlsForMode() {
        const locked = selectedGameMode === 'arcade';
        playersPrevBtn.disabled = locked;
        playersNextBtn.disabled = locked;
        playersPrevBtn.classList.toggle('is-disabled', locked);
        playersNextBtn.classList.toggle('is-disabled', locked);
        continueToBoardsBtn.textContent = locked ? 'Empezar Arcade' : 'Continuar';
        playerSetupHead?.classList.toggle('hidden', locked);
        playerSymbolsContainer.classList.toggle('arcade-centered', locked);
    }

    function startArcadeRun() {
        selectedPlayers = 2;
        arcadeOpponentSymbols = [...ARCADE_BOSS_ORDER];
        arcadeOpponentIndex = 0;
        arcadeSeriesPlayerWins = 0;
        arcadeSeriesCpuWins = 0;
        arcadeScenarioCursor = 0;
        arcadeBossPlayerPoints = 0;
        arcadeBossCpuPoints = 0;
        arcadeGlobalPlayerWins = 0;
        arcadeGlobalCpuWins = 0;
        selectedBoardMode = 'arcade';
        if (!arcadeOpponentSymbols.length) {
            alert('No hay fichas rivales disponibles.');
            return;
        }
        // Show game layer first so first boss intro screen is visible.
        configPanel.classList.add('hidden');
        gameArea.classList.remove('hidden');
        homeBtn.classList.remove('hidden');
        topGameActions.classList.remove('hidden');
        gameActive = false;

        playBossIntroSound();
        const firstRival = arcadeOpponentSymbols[0];
        showNextOpponentScreen(firstRival, 2400, startArcadeGame, 'PRO CHALLENGER', `MATCH 1/3 · GLOBAL ${arcadeGlobalPlayerWins}-${arcadeGlobalCpuWins}`);
    }

    function startArcadeGame() {
        const level = ARCADE_SCENARIOS[arcadeScenarioCursor % ARCADE_SCENARIOS.length];
        const bossSymbol = arcadeOpponentSymbols[arcadeOpponentIndex];
        playerSymbols[1] = getArcadeCpuPlaySymbol(bossSymbol);
        selectedBoard = {
            rows: level.rows,
            cols: level.cols,
            targetLines: level.targetLines
        };
        const matchNumber = Math.min(3, arcadeSeriesPlayerWins + arcadeSeriesCpuWins + 1);
        showMatchIntroScreen(matchNumber, initializeGame);
    }

    function getArcadeCpuPlaySymbol(bossSymbol) {
        if (bossSymbol !== playerSymbols[0]) return bossSymbol;
        const fallback = ARCADE_ALT_TOKENS.find(token => token !== playerSymbols[0]);
        return fallback || '2';
    }

    function displaySymbol(symbol) {
        return DISPLAY_SYMBOLS[symbol] || symbol;
    }

    function uiSymbolForPlayerIndex(playerIndex) {
        if (selectedGameMode === 'arcade' && playerIndex === 1) {
            const bossSymbol = arcadeOpponentSymbols[arcadeOpponentIndex];
            return displaySymbol(bossSymbol || playerSymbols[playerIndex]);
        }
        return displaySymbol(playerSymbols[playerIndex]);
    }

    function shiftPlayers(direction) {
        if (selectedGameMode === 'arcade') return;
        selectedPlayers += direction;
        if (selectedPlayers < 2) selectedPlayers = 4;
        if (selectedPlayers > 4) selectedPlayers = 2;
        updatePlayersDisplay();
        renderPlayerSymbolSelectors();
        filterBoardCards();
    }

    function filterBoardCards() {
        let firstVisibleCard = null;
        const isMobileDevice = window.innerWidth <= 820;

        boardCards.forEach(card => {
            const minPlayers = parseInt(card.dataset.minPlayers) || 2;
            const maxPlayers = parseInt(card.dataset.maxPlayers) || 4;
            const deviceType = card.dataset.device || 'all';

            let visible = selectedPlayers >= minPlayers && selectedPlayers <= maxPlayers;

            // Device-specific layout filtering
            if (visible) {
                if (isMobileDevice && deviceType === 'desktop') {
                    visible = false;
                } else if (!isMobileDevice && deviceType === 'mobile') {
                    visible = false;
                }
            }

            card.classList.toggle('hidden', !visible);
            if (visible && !firstVisibleCard) firstVisibleCard = card;
        });

        const currentStillVisible = boardCards.find(card =>
            card.classList.contains('active') && !card.classList.contains('hidden')
        );

        if (!currentStillVisible && firstVisibleCard) {
            selectBoard(firstVisibleCard);
        }
    }

    function selectBoard(card) {
        if (card.classList.contains('hidden')) return;

        if (card.dataset.custom === 'true') {
            selectedBoardMode = 'custom';
            showSetupStep(4);
            return;
        }

        selectedBoardMode = 'preset';
        boardCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedBoard = {
            rows: parseInt(card.dataset.rows) || 3,
            cols: parseInt(card.dataset.cols) || 3,
            targetLines: parseInt(card.dataset.targetLines) || 1
        };
    }

    function initializeGameFromCustomBoard() {
        selectedBoardMode = 'custom';
        selectedBoard = {
            rows: parseInt(customRowsInput.value) || 6,
            cols: parseInt(customColsInput.value) || 6,
            targetLines: parseInt(customTargetLinesInput.value) || 4
        };
        initializeGame();
    }

    function getNextAvailableSymbol(playerIndex, direction, playersCount) {
        const current = playerSymbols[playerIndex] || SYMBOL_POOL[playerIndex % SYMBOL_POOL.length];
        let cursor = SYMBOL_POOL.indexOf(current);
        if (cursor < 0) cursor = 0;

        for (let step = 1; step <= SYMBOL_POOL.length; step++) {
            const idx = (cursor + direction * step + SYMBOL_POOL.length) % SYMBOL_POOL.length;
            const candidate = SYMBOL_POOL[idx];
            const alreadyUsed = playerSymbols.some((s, i) => i < playersCount && i !== playerIndex && s === candidate);
            if (!alreadyUsed) return candidate;
        }
        return current;
    }

    function getCharacterImagePath(symbol, useCloseUp = false) {
        if (useCloseUp) {
            return CHARACTER_CLOSEUP_IMAGES[symbol] || CHARACTER_IMAGES[symbol];
        }
        return CHARACTER_IMAGES[symbol];
    }

    function appendCharacterVisual(container, symbol, className, options = {}) {
        const imgPath = getCharacterImagePath(symbol, !!options.useCloseUp);
        if (imgPath) {
            const img = document.createElement('img');
            img.className = className;
            if (options.mirror) img.classList.add('is-mirrored');
            img.src = imgPath;
            img.alt = symbol;
            container.appendChild(img);
            return;
        }
        container.textContent = displaySymbol(symbol);
    }

    function renderPlayerSymbolSelectors() {
        const playersCount = selectedGameMode === 'arcade' ? 1 : selectedPlayers;
        playerSymbolsContainer.innerHTML = '';

        for (let i = 0; i < playersCount; i++) {
            const currentSymbol = playerSymbols[i] || SYMBOL_POOL[i];
            if (!playerSymbols[i]) playerSymbols[i] = currentSymbol;

            const row = document.createElement('div');
            row.className = 'player-symbol-row';

            const label = document.createElement('label');
            label.textContent = `Jugador ${i + 1}`;
            label.style.color = getColorForSymbol(currentSymbol, i);

            const carousel = document.createElement('div');
            carousel.className = 'symbol-carousel';

            const prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'symbol-nav';
            prevBtn.textContent = '◀';
            prevBtn.setAttribute('aria-label', `Ficha anterior jugador ${i + 1}`);
            prevBtn.addEventListener('click', () => {
                playerSymbols[i] = getNextAvailableSymbol(i, -1, playersCount);
                renderPlayerSymbolSelectors();
            });

            const symbolDisplay = document.createElement('div');
            symbolDisplay.className = `symbol-display ${getClassForSymbol(currentSymbol, i)}`;
            appendCharacterVisual(symbolDisplay, currentSymbol, 'character-avatar');

            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'symbol-nav';
            nextBtn.textContent = '▶';
            nextBtn.setAttribute('aria-label', `Ficha siguiente jugador ${i + 1}`);
            nextBtn.addEventListener('click', () => {
                playerSymbols[i] = getNextAvailableSymbol(i, 1, playersCount);
                renderPlayerSymbolSelectors();
            });

            row.appendChild(label);
            carousel.appendChild(prevBtn);
            carousel.appendChild(symbolDisplay);
            carousel.appendChild(nextBtn);
            row.appendChild(carousel);
            playerSymbolsContainer.appendChild(row);
        }
    }

    function initializeGame() {
        if (selectedGameMode === 'arcade') selectedPlayers = 2;

        if (selectedBoardMode === 'custom') {
            selectedBoard.rows = Math.max(3, Math.min(20, selectedBoard.rows));
            selectedBoard.cols = Math.max(3, Math.min(20, selectedBoard.cols));
            selectedBoard.targetLines = Math.max(1, Math.min(30, selectedBoard.targetLines));
        }

        config.rows = selectedBoard.rows;
        config.cols = selectedBoard.cols;
        config.winLength = 3;
        config.targetLines = selectedBoard.targetLines;
        config.numPlayers = selectedPlayers;
        playerSymbols = playerSymbols.slice(0, config.numPlayers);

        if (new Set(playerSymbols).size !== playerSymbols.length) {
            alert('Cada jugador debe usar una ficha distinta.');
            return;
        }

        if (config.rows < 3 || config.cols < 3) {
            alert('El tablero debe ser al menos de 3x3.');
            return;
        }
        if (config.winLength < 3) {
            alert('La longitud para ganar debe ser al menos 3.');
            return;
        }
        if (config.winLength > Math.max(config.rows, config.cols)) {
            alert('La longitud para ganar no puede ser mayor que las dimensiones del tablero.');
            return;
        }

        configPanel.classList.add('hidden');
        gameArea.classList.remove('hidden');
        homeBtn.classList.remove('hidden');
        topGameActions.classList.remove('hidden');

        setupPlayersUI();
        resetBoard();
    }

    function setupPlayersUI() {
        leftScoreSlot.innerHTML = '';
        rightScoreSlot.innerHTML = '';

        scores = {};
        points = {};

        if (config.numPlayers > 2) {
            leftScorePanel.classList.add('compact-scores');
            rightScorePanel.classList.add('compact-scores');
        } else {
            leftScorePanel.classList.remove('compact-scores');
            rightScorePanel.classList.remove('compact-scores');
        }

        for (let i = 0; i < config.numPlayers; i++) {
            const sym = playerSymbols[i];
            scores[sym] = 0;
            points[sym] = 0;
            const scoreWrap = document.createElement('div');
            scoreWrap.className = 'player-score-wrap';
            scoreWrap.id = `score-p${i}`;

            const visualSym = (selectedGameMode === 'arcade' && i === 1)
                ? (arcadeOpponentSymbols[arcadeOpponentIndex] || sym)
                : sym;

            const scoreTop = document.createElement('div');
            scoreTop.className = `player-score-top ${getClassForSymbol(visualSym, i)}`;

            const symbolEl = document.createElement('div');
            symbolEl.className = `player-score-avatar ${getClassForSymbol(visualSym, i)}`;
            appendCharacterVisual(symbolEl, visualSym, 'score-character-avatar', {
                useCloseUp: true,
                mirror: i !== 0
            });

            const scoreBox = document.createElement('div');
            scoreBox.className = 'player-score-box';

            const valueEl = document.createElement('div');
            valueEl.className = 'player-score-value';
            valueEl.id = `score-p${i}-value`;
            valueEl.textContent = String(config.targetLines);

            scoreTop.appendChild(symbolEl);
            scoreBox.appendChild(valueEl);
            scoreWrap.appendChild(scoreTop);
            scoreWrap.appendChild(scoreBox);
            if (i === 0) {
                leftScoreSlot.appendChild(scoreWrap);
            } else if (i === 1) {
                rightScoreSlot.appendChild(scoreWrap);
            } else if (i % 2 === 0) {
                leftScoreSlot.appendChild(scoreWrap);
            } else {
                rightScoreSlot.appendChild(scoreWrap);
            }
        }
    }

    function showConfig() {
        gameArea.classList.add('hidden');
        configPanel.classList.remove('hidden');
        homeBtn.classList.add('hidden');
        topGameActions.classList.add('hidden');
        showSetupStep(1);
        filterBoardCards();
    }

    function showResultModal(title, subtitle, type = 'victory') {
        modalTitle.textContent = title;
        modalTitle.className = '';
        modalTitle.classList.add(type);
        modalSubtitle.textContent = subtitle;
        gameOverModal.classList.remove('hidden');
    }

    function hideResultModal() {
        gameOverModal.classList.add('hidden');
    }

    // Set up click listeners for modal actions
    modalRestartBtn.addEventListener('click', () => {
        hideResultModal();
        if (selectedGameMode === 'arcade') {
            startArcadeRun();
        } else {
            resetBoard();
        }
    });

    modalMenuBtn.addEventListener('click', () => {
        hideResultModal();
        showConfig();
    });

    function resetBoard() {
        board = Array(config.rows * config.cols).fill(null);
        currentPlayerIndex = 0;
        allWinningLines = [];
        gameActive = true;
        for (let sym in scores) scores[sym] = 0;
        for (let sym in points) points[sym] = 0;
        updateScoreDisplay();
        updateTurnDisplay();
        renderBoard();
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        const strikeContainer = document.createElement('div');
        strikeContainer.id = 'strike-lines-container';
        gameBoard.appendChild(strikeContainer);
        
        const boardStage = document.querySelector('.board-stage');
        const controls = boardStage?.querySelector('.controls');
        const stageWidth = boardStage?.clientWidth || gameArea.clientWidth || window.innerWidth * 0.9;
        const containerWidth = Math.max(120, stageWidth - 28);
        const turnHeight = turnDisplay?.offsetHeight || 0;
        const controlsHeight = controls?.offsetHeight || 0;
        const stageHeight = boardStage?.clientHeight || Math.floor(window.innerHeight * 0.72);
        const availableHeight = Math.max(120, stageHeight - turnHeight - controlsHeight - 36);
        
        const gapSize = 4;
        const totalGapWidth = (config.cols - 1) * gapSize;
        const totalGapHeight = (config.rows - 1) * gapSize;
        
        const maxCellW = Math.floor((containerWidth - totalGapWidth - 20) / config.cols);
        const maxCellH = Math.floor((availableHeight - totalGapHeight - 20) / config.rows);
        
        const isMobileOrTablet = window.innerWidth <= 820;
        const minCellSize = isMobileOrTablet ? 36 : 12;
        const cellSize = Math.max(minCellSize, Math.min(maxCellW, maxCellH, 80));
        
        gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, ${cellSize}px)`;
        gameBoard.style.gridTemplateRows = `repeat(${config.rows}, ${cellSize}px)`;
        gameBoard.style.width = 'fit-content';

        for (let i = 0; i < board.length; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.fontSize = `${cellSize * 0.6}px`;
            
            if (board[i]) {
                const pIdx = playerSymbols.indexOf(board[i]);
                cell.textContent = pIdx >= 0 ? uiSymbolForPlayerIndex(pIdx) : displaySymbol(board[i]);
                cell.classList.add(getClassForSymbol(board[i], pIdx >= 0 ? pIdx : 0));
            }
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
        renderStrikeLines();
    }

    function ensureAudioContext() {
        if (!audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playTone({ frequency, duration = 0.12, type = 'square', volume = 0.08, delay = 0, endFrequency = null }) {
        const ctx = ensureAudioContext();
        if (!ctx) return;

        const startAt = ctx.currentTime + delay;
        const endAt = startAt + duration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startAt);
        if (endFrequency) {
            osc.frequency.linearRampToValueAtTime(endFrequency, endAt);
        }

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(endAt + 0.01);
    }

    function playMoveSound(playerIndex) {
        const baseFreq = [330, 262, 392, 294][playerIndex] || 330;
        playTone({
            frequency: baseFreq,
            endFrequency: baseFreq * 1.08,
            duration: 0.1,
            type: 'square',
            volume: 0.06
        });
    }

    function playUiClickSound() {
        playTone({
            frequency: 520,
            endFrequency: 560,
            duration: 0.05,
            type: 'square',
            volume: 0.035
        });
    }

    function playUiSelectSound() {
        playTone({
            frequency: 620,
            endFrequency: 760,
            duration: 0.08,
            type: 'triangle',
            volume: 0.045
        });
    }

    function playLineSound(lineNumber) {
        const delayBase = Math.max(0, lineNumber - 1) * 0.14;
        playTone({ frequency: 523, duration: 0.09, type: 'triangle', volume: 0.09, delay: delayBase });
        playTone({ frequency: 659, duration: 0.09, type: 'triangle', volume: 0.085, delay: delayBase + 0.05 });
        playTone({ frequency: 784, duration: 0.14, type: 'sawtooth', volume: 0.08, delay: delayBase + 0.1 });
    }

    function playSpecialLineSound(linesGained) {
        // Extra arcade stinger when at least one line is completed
        playTone({ frequency: 880, endFrequency: 1046, duration: 0.16, type: 'square', volume: 0.1 });
        playTone({ frequency: 659, endFrequency: 784, duration: 0.14, type: 'triangle', volume: 0.08, delay: 0.03 });

        // Combo accent if the move created multiple lines
        if (linesGained > 1) {
            playTone({ frequency: 440, endFrequency: 1320, duration: 0.22, type: 'sawtooth', volume: 0.09, delay: 0.08 });
            playTone({ frequency: 988, duration: 0.12, type: 'square', volume: 0.08, delay: 0.12 });
        }
    }

    function playVictorySound() {
        // Longer victory fanfare
        playTone({ frequency: 523, duration: 0.22, type: 'triangle', volume: 0.1 });
        playTone({ frequency: 659, duration: 0.22, type: 'triangle', volume: 0.095, delay: 0.16 });
        playTone({ frequency: 784, duration: 0.24, type: 'triangle', volume: 0.095, delay: 0.32 });
        playTone({ frequency: 988, duration: 0.28, type: 'sawtooth', volume: 0.09, delay: 0.5, endFrequency: 1175 });
        playTone({ frequency: 1319, duration: 0.32, type: 'square', volume: 0.085, delay: 0.72 });
    }

    function playBossIntroSound() {
        playTone({ frequency: 392, duration: 0.2, type: 'sawtooth', volume: 0.09 });
        playTone({ frequency: 523, duration: 0.2, type: 'sawtooth', volume: 0.09, delay: 0.14 });
        playTone({ frequency: 659, duration: 0.22, type: 'sawtooth', volume: 0.1, delay: 0.28 });
        playTone({ frequency: 880, duration: 0.26, type: 'square', volume: 0.085, delay: 0.48 });
    }

    function ensureFxOverlay() {
        if (fxOverlay) return fxOverlay;
        fxOverlay = document.createElement('div');
        fxOverlay.id = 'game-fx-overlay';
        fxOverlay.innerHTML = `
            <div class="fx-title"></div>
            <div class="fx-subtitle"></div>
        `;
        const boardStage = document.querySelector('.board-stage');
        (boardStage || gameArea).appendChild(fxOverlay);
        return fxOverlay;
    }

    function showGameBanner(title, subtitle = '', type = 'victory', durationMs = 1500) {
        const overlay = ensureFxOverlay();
        overlay.className = '';
        overlay.classList.add(type, 'show');
        overlay.querySelector('.fx-title').textContent = title;
        overlay.querySelector('.fx-subtitle').textContent = subtitle;

        setTimeout(() => {
            overlay.classList.remove('show');
        }, durationMs);
    }

    function showNextOpponentScreen(
        symbol,
        durationMs = 2600,
        onDone = null,
        title = 'NEXT OPPONENT',
        subtitle = '',
        showAvatar = true,
        screenClass = ''
    ) {
        nextScreenTitle.textContent = title;
        nextScreenSubtitle.textContent = subtitle;
        arcadeNextScreen.className = '';
        if (screenClass) arcadeNextScreen.classList.add(screenClass);
        arcadeNextScreen.classList.remove('hidden');

        if (showAvatar) {
            const imgPath = CHARACTER_IMAGES[symbol];
            if (imgPath) {
                nextOpponentAvatar.src = imgPath;
                nextOpponentAvatar.classList.remove('hidden');
                nextOpponentFallback.classList.add('hidden');
            } else {
                nextOpponentFallback.textContent = displaySymbol(symbol);
                nextOpponentFallback.classList.remove('hidden');
                nextOpponentAvatar.classList.add('hidden');
            }
            arcadeNextScreen.classList.remove('no-avatar');
        } else {
            nextOpponentAvatar.classList.add('hidden');
            nextOpponentFallback.classList.add('hidden');
            arcadeNextScreen.classList.add('no-avatar');
        }

        setTimeout(() => {
            arcadeNextScreen.classList.add('hidden');
            if (onDone) onDone();
        }, durationMs);
    }

    function showMatchIntroScreen(matchNumber, onDone) {
        const rival = arcadeOpponentSymbols[arcadeOpponentIndex] || playerSymbols[1];
        showNextOpponentScreen(
            rival,
            1200,
            onDone,
            `MATCH ${matchNumber}/3`,
            `VS ${rival} · GLOBAL ${arcadeGlobalPlayerWins}-${arcadeGlobalCpuWins}`,
            false,
            'match-intro'
        );
    }

    function triggerLineVisualEffects(playerIndex, linesGained) {
        const boardStage = document.querySelector('.board-stage');
        if (boardStage) {
            boardStage.classList.remove('line-burst');
            void boardStage.offsetWidth; // restart animation
            boardStage.classList.add('line-burst');
        }

        const scoreCard = document.getElementById(`score-p${playerIndex}`);
        if (scoreCard) {
            scoreCard.classList.remove('line-hit');
            if (linesGained > 1) scoreCard.classList.add('combo-hit');
            else scoreCard.classList.remove('combo-hit');
            void scoreCard.offsetWidth; // restart animation
            scoreCard.classList.add('line-hit');
            setTimeout(() => {
                scoreCard.classList.remove('combo-hit');
            }, 420);
        }
    }

    function handleCellClick(e) {
        if (selectedGameMode === 'arcade' && currentPlayerIndex === 1) return;
        const index = parseInt(e.target.dataset.index);
        applyMove(index);
    }

    function applyMove(index) {
        const currentPlayer = playerSymbols[currentPlayerIndex];
        if (board[index] || !gameActive) return;

        board[index] = currentPlayer;
        const cellEl = gameBoard.querySelector(`.cell[data-index="${index}"]`);
        if (cellEl) {
            cellEl.textContent = uiSymbolForPlayerIndex(currentPlayerIndex);
            cellEl.classList.add(getClassForSymbol(currentPlayer, currentPlayerIndex));
        }

        const prevScore = scores[currentPlayer] || 0;
        playMoveSound(currentPlayerIndex);
        recalculateAllWinningLines();
        const linesGained = Math.max(0, (scores[currentPlayer] || 0) - prevScore);
        const comboBonus = linesGained > 1 ? (linesGained - 1) * COMBO_EXTRA_PER_LINE : 0;
        const gainedPoints = MOVE_POINTS + (linesGained * LINE_POINTS) + comboBonus;
        points[currentPlayer] = (points[currentPlayer] || 0) + gainedPoints;
        for (let i = 1; i <= linesGained; i++) {
            playLineSound(i);
        }
        if (linesGained > 0) {
            playSpecialLineSound(linesGained);
            triggerLineVisualEffects(currentPlayerIndex, linesGained);
        }
        updateScoreDisplay();
        renderStrikeLines();

        const remainingForCurrent = config.targetLines - (scores[currentPlayer] || 0);
        if (remainingForCurrent <= 0) {
            gameActive = false;
            playVictorySound();
            if (selectedGameMode === 'arcade') {
                handleArcadeGameResult(currentPlayerIndex === 0 ? 'player' : 'cpu');
            } else {
                showGameBanner('VICTORIA', `Jugador ${displaySymbol(currentPlayer)}`, 'victory', 1800);
                turnDisplay.textContent = `¡Jugador ${displaySymbol(currentPlayer)} Gana!`;
                setTimeout(() => {
                    showResultModal('¡VICTORIA!', `El Jugador ${displaySymbol(currentPlayer)} ha ganado la partida.`, 'victory');
                }, 1000);
            }
            return;
        }
        if (!board.includes(null)) {
            gameActive = false;
            if (selectedGameMode === 'arcade') {
                handleArcadeGameResult('draw');
            } else {
                turnDisplay.textContent = "¡Empate!";
                setTimeout(() => {
                    showResultModal('¡EMPATE!', 'No quedan más casillas disponibles para jugar.', 'draw');
                }, 1000);
            }
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % config.numPlayers;
        updateTurnDisplay();

        if (selectedGameMode === 'arcade' && currentPlayerIndex === 1 && gameActive) {
            setTimeout(() => {
                if (!gameActive) return;
                const aiMove = chooseArcadeMove();
                if (aiMove >= 0) applyMove(aiMove);
            }, 260);
        }
    }

    function chooseArcadeMove() {
        const aiSymbol = playerSymbols[1];
        const humanSymbol = playerSymbols[0];
        const emptyCells = board.map((v, i) => (v === null ? i : -1)).filter(i => i >= 0);
        if (!emptyCells.length) return -1;

        const bossSymbol = arcadeOpponentSymbols[arcadeOpponentIndex] || aiSymbol;
        const profiles = window.ArcadeAiProfiles || {};
        const pickMove = profiles[bossSymbol] || profiles[aiSymbol];

        if (typeof pickMove === 'function') {
            const context = {
                board: board.slice(),
                config: { ...config },
                aiSymbol,
                humanSymbol,
                candidates: emptyCells.slice(),
                getLineCount: (boardState, symbol) => calculateWinningLinesForPlayer(symbol, boardState, config).length
            };
            const picked = pickMove(context);
            if (Number.isInteger(picked) && picked >= 0 && picked < board.length && board[picked] === null) {
                return picked;
            }
        }

        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function handleArcadeGameResult(result) {
        const rival = arcadeOpponentSymbols[arcadeOpponentIndex];
        arcadeBossPlayerPoints += points[playerSymbols[0]] || 0;
        arcadeBossCpuPoints += points[playerSymbols[1]] || 0;

        if (result === 'draw') {
            turnDisplay.textContent = `Empate vs ${rival} (no cuenta)`;
            arcadeScenarioCursor = (arcadeScenarioCursor + 1) % ARCADE_SCENARIOS.length;
            setTimeout(startArcadeGame, 900);
            return;
        }

        if (result === 'player') arcadeSeriesPlayerWins++;
        else arcadeSeriesCpuWins++;
        if (result === 'player') arcadeGlobalPlayerWins++;
        else arcadeGlobalCpuWins++;

        if (arcadeSeriesPlayerWins >= 2) {
            if (arcadeOpponentIndex >= arcadeOpponentSymbols.length - 1) {
                showGameBanner(
                    'ARCADE COMPLETADO',
                    `Has derrotado a todos los jefes\nPuntos finales vs ${rival}: ${arcadeBossPlayerPoints} - ${arcadeBossCpuPoints}`,
                    'victory',
                    3000
                );
                turnDisplay.textContent = '¡Arcade completado!';
                setTimeout(() => {
                    showResultModal(
                        '¡ARCADE COMPLETADO!',
                        `¡Increíble! Has derrotado a todos los jefes.\nVictorias totales: ${arcadeGlobalPlayerWins} - ${arcadeGlobalCpuWins}\nPuntos contra último jefe: ${arcadeBossPlayerPoints} - ${arcadeBossCpuPoints}`,
                        'victory'
                    );
                }, 1500);
                return;
            }

            const nextRival = arcadeOpponentSymbols[arcadeOpponentIndex + 1];
            turnDisplay.textContent = `Superas a ${rival} (2-${arcadeSeriesCpuWins})`;
            showGameBanner(
                `JEFE ${rival} DERROTADO`,
                `Puntos totales: ${arcadeBossPlayerPoints} - ${arcadeBossCpuPoints}\nNUEVO BOSS: ${nextRival}`,
                'boss-intro',
                1600
            );
            playBossIntroSound();
            arcadeOpponentIndex++;
            arcadeSeriesPlayerWins = 0;
            arcadeSeriesCpuWins = 0;
            arcadeScenarioCursor = 0;
            arcadeBossPlayerPoints = 0;
            arcadeBossCpuPoints = 0;
            setTimeout(() => {
                showNextOpponentScreen(
                    nextRival,
                    2600,
                    startArcadeGame,
                    'NEXT OPPONENT',
                    `MATCH 1/3 · GLOBAL ${arcadeGlobalPlayerWins}-${arcadeGlobalCpuWins}`
                );
            }, 1700);
            return;
        }

        if (arcadeSeriesCpuWins >= 2) {
            showGameBanner('DERROTA', `El jefe ${rival} te supero`, 'defeat', 2000);
            turnDisplay.textContent = `Derrota vs ${rival}`;
            setTimeout(() => {
                showResultModal(
                    '¡DERROTA!',
                    `El jefe ${rival} te ha superado.\nMarcador de serie: ${arcadeSeriesPlayerWins} - ${arcadeSeriesCpuWins}\nPuntos de la serie: ${arcadeBossPlayerPoints} - ${arcadeBossCpuPoints}`,
                    'defeat'
                );
            }, 1200);
            return;
        }

        turnDisplay.textContent = `Marcador vs ${rival}: ${arcadeSeriesPlayerWins}-${arcadeSeriesCpuWins}`;
        arcadeScenarioCursor = (arcadeScenarioCursor + 1) % ARCADE_SCENARIOS.length;
        setTimeout(startArcadeGame, 1000);
    }

    function recalculateAllWinningLines() {
        allWinningLines = [];
        for (let i = 0; i < config.numPlayers; i++) {
            const player = playerSymbols[i];
            const lines = calculateWinningLinesForPlayer(player);
            scores[player] = lines.length;
            lines.forEach(l => allWinningLines.push({ ...l, playerIdx: i }));
        }
    }

    function calculateWinningLinesForPlayer(player, boardState = board, cfg = config) {
        const winningLines = [];
        const N = cfg.winLength;
        const R = cfg.rows;
        const C = cfg.cols;
        const usedByDirection = {
            horizontal: new Set(),
            vertical: new Set(),
            diagonalDown: new Set(), // "\"
            diagonalUp: new Set() // "/"
        };

        function tryAddLine(direction, indices, start, end) {
            const used = usedByDirection[direction];
            const overlaps = indices.some(idx => used.has(idx));
            if (overlaps) return;

            indices.forEach(idx => used.add(idx));
            winningLines.push({ start, end });
        }

        // Horizontal
        for (let r = 0; r < R; r++) {
            for (let c = 0; c <= C - N; c++) {
                const indices = [];
                let match = true;
                for (let i = 0; i < N; i++) {
                    const idx = r * C + (c + i);
                    if (boardState[idx] !== player) {
                        match = false;
                        break;
                    }
                    indices.push(idx);
                }
                if (match) {
                    tryAddLine('horizontal', indices, indices[0], indices[indices.length - 1]);
                }
            }
        }

        // Vertical
        for (let c = 0; c < C; c++) {
            for (let r = 0; r <= R - N; r++) {
                const indices = [];
                let match = true;
                for (let i = 0; i < N; i++) {
                    const idx = (r + i) * C + c;
                    if (boardState[idx] !== player) {
                        match = false;
                        break;
                    }
                    indices.push(idx);
                }
                if (match) {
                    tryAddLine('vertical', indices, indices[0], indices[indices.length - 1]);
                }
            }
        }

        // Diagonals "\"
        for (let r = 0; r <= R - N; r++) {
            for (let c = 0; c <= C - N; c++) {
                const indices = [];
                let match = true;
                for (let i = 0; i < N; i++) {
                    const idx = (r + i) * C + (c + i);
                    if (boardState[idx] !== player) {
                        match = false;
                        break;
                    }
                    indices.push(idx);
                }
                if (match) {
                    tryAddLine('diagonalDown', indices, indices[0], indices[indices.length - 1]);
                }
            }
        }

        // Diagonals "/"
        for (let r = 0; r <= R - N; r++) {
            for (let c = N - 1; c < C; c++) {
                const indices = [];
                let match = true;
                for (let i = 0; i < N; i++) {
                    const idx = (r + i) * C + (c - i);
                    if (boardState[idx] !== player) {
                        match = false;
                        break;
                    }
                    indices.push(idx);
                }
                if (match) {
                    tryAddLine('diagonalUp', indices, indices[0], indices[indices.length - 1]);
                }
            }
        }
        return winningLines;
    }

    function renderStrikeLines() {
        const container = document.getElementById('strike-lines-container');
        if (!container) return;
        const cells = Array.from(gameBoard.querySelectorAll('.cell'));
        const byIndex = new Map(cells.map(c => [parseInt(c.dataset.index), c]));
        const existing = new Map(
            Array.from(container.querySelectorAll('.strike-line')).map(el => [el.dataset.lineKey, el])
        );
        const nextKeys = new Set();

        allWinningLines.forEach(line => {
            const lineKey = `${line.start}-${line.end}-${line.playerIdx}`;
            nextKeys.add(lineKey);
            if (existing.has(lineKey)) return;

            const startCell = byIndex.get(line.start);
            const endCell = byIndex.get(line.end);
            if (!startCell || !endCell) return;

            // Get centers relative to the game board
            const x1 = startCell.offsetLeft + startCell.offsetWidth / 2;
            const y1 = startCell.offsetTop + startCell.offsetHeight / 2;
            const x2 = endCell.offsetLeft + endCell.offsetWidth / 2;
            const y2 = endCell.offsetTop + endCell.offsetHeight / 2;

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            const symbol = playerSymbols[line.playerIdx];
            const lineEl = document.createElement('div');
            lineEl.dataset.lineKey = lineKey;
            lineEl.classList.add('strike-line', getClassForSymbol(symbol, line.playerIdx));
            lineEl.style.width = `${length}px`;
            lineEl.style.left = `${x1}px`;
            lineEl.style.top = `${y1}px`;
            lineEl.style.setProperty('--rot', `${angle}deg`);
            lineEl.style.transform = `rotate(${angle}deg)`;
            container.appendChild(lineEl);
        });

        existing.forEach((el, key) => {
            if (!nextKeys.has(key)) el.remove();
        });
    }

    function updateTurnDisplay() {
        const player = playerSymbols[currentPlayerIndex];
        if (selectedGameMode === 'arcade') {
            const rival = arcadeOpponentSymbols[arcadeOpponentIndex] || playerSymbols[1];
            const matchNumber = Math.min(3, arcadeSeriesPlayerWins + arcadeSeriesCpuWins + 1);
            turnDisplay.textContent = `VS ${displaySymbol(rival)} · MATCH ${matchNumber}/3 · SERIE ${arcadeSeriesPlayerWins}-${arcadeSeriesCpuWins} · GLOBAL ${arcadeGlobalPlayerWins}-${arcadeGlobalCpuWins} · Turno: ${uiSymbolForPlayerIndex(currentPlayerIndex)}`;
        } else {
            turnDisplay.textContent = `Turno: ${displaySymbol(player)}`;
        }
        turnDisplay.style.color = getColorForSymbol(player, currentPlayerIndex);

        if (config.numPlayers === 2) {
            leftScorePanel.classList.toggle('active-side', currentPlayerIndex === 0);
            rightScorePanel.classList.toggle('active-side', currentPlayerIndex === 1);
        } else {
            leftScorePanel.classList.remove('active-side');
            rightScorePanel.classList.remove('active-side');
        }

        document.querySelectorAll('.player-score-wrap').forEach((el, idx) => {
            el.classList.toggle('active', idx === currentPlayerIndex);
            const sym = playerSymbols[idx];
            el.style.borderColor = idx === currentPlayerIndex ? getColorForSymbol(sym, idx) : 'transparent';
        });
    }

    function updateScoreDisplay() {
        for (let i = 0; i < config.numPlayers; i++) {
            const sym = playerSymbols[i];
            const el = document.getElementById(`score-p${i}-value`);
            const remaining = Math.max(0, config.targetLines - (scores[sym] || 0));
            if (el) el.textContent = String(remaining);
        }
    }
});

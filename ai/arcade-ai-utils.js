(function () {
    const ArcadeAiUtils = {
        getEmptyCells(board) {
            const cells = [];
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) cells.push(i);
            }
            return cells;
        },

        randomPick(list) {
            if (!list || !list.length) return -1;
            return list[Math.floor(Math.random() * list.length)];
        },

        getCenterIndex(config) {
            const centerRow = Math.floor(config.rows / 2);
            const centerCol = Math.floor(config.cols / 2);
            return centerRow * config.cols + centerCol;
        },

        applyMove(board, index, symbol) {
            const next = board.slice();
            next[index] = symbol;
            return next;
        },

        scoreCenterBias(config, index) {
            const row = Math.floor(index / config.cols);
            const col = index % config.cols;
            const centerRow = (config.rows - 1) / 2;
            const centerCol = (config.cols - 1) / 2;
            const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol);
            return -dist;
        },

        getNeighbors(index, config) {
            const row = Math.floor(index / config.cols);
            const col = index % config.cols;
            const neighbors = [];

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
                        neighbors.push((nr * config.cols) + nc);
                    }
                }
            }

            return neighbors;
        },

        countAdjacent(board, config, index, symbol) {
            let count = 0;
            const neighbors = this.getNeighbors(index, config);
            for (let i = 0; i < neighbors.length; i++) {
                if (board[neighbors[i]] === symbol) count++;
            }
            return count;
        },

        findImmediateLineMove(ctx, player, candidates) {
            const moves = candidates || ctx.candidates;
            const baseLines = ctx.getLineCount(ctx.board, player);
            for (let i = 0; i < moves.length; i++) {
                const idx = moves[i];
                const nextBoard = this.applyMove(ctx.board, idx, player);
                const nextLines = ctx.getLineCount(nextBoard, player);
                if (nextLines > baseLines) return idx;
            }
            return -1;
        },

        countImmediateLineMoves(ctx, boardState, player, candidates) {
            const moves = candidates || this.getEmptyCells(boardState);
            const baseLines = ctx.getLineCount(boardState, player);
            let count = 0;

            for (let i = 0; i < moves.length; i++) {
                const idx = moves[i];
                const nextBoard = this.applyMove(boardState, idx, player);
                const nextLines = ctx.getLineCount(nextBoard, player);
                if (nextLines > baseLines) count++;
            }

            return count;
        },

        topCandidatesByHeuristic(ctx, boardState, candidates, limit) {
            const sourceBoard = boardState || ctx.board;
            const moves = candidates || this.getEmptyCells(sourceBoard);
            const scored = moves.map((idx) => {
                const ownAdj = this.countAdjacent(sourceBoard, ctx.config, idx, ctx.aiSymbol);
                const enemyAdj = this.countAdjacent(sourceBoard, ctx.config, idx, ctx.humanSymbol);
                const center = this.scoreCenterBias(ctx.config, idx);
                const score = (ownAdj * 1.6) + (enemyAdj * 0.9) + (center * 0.35);
                return { idx, score };
            });

            scored.sort((a, b) => b.score - a.score);
            return scored.slice(0, Math.max(1, limit || scored.length)).map((item) => item.idx);
        }
    };

    window.ArcadeAiUtils = ArcadeAiUtils;
    window.ArcadeAiProfiles = window.ArcadeAiProfiles || {};
})();

(function () {
    const utils = window.ArcadeAiUtils;

    function evaluateState(ctx, boardState) {
        const empties = utils.getEmptyCells(boardState);
        const aiLines = ctx.getLineCount(boardState, ctx.aiSymbol);
        const humanLines = ctx.getLineCount(boardState, ctx.humanSymbol);
        const aiThreats = utils.countImmediateLineMoves(ctx, boardState, ctx.aiSymbol, empties);
        const humanThreats = utils.countImmediateLineMoves(ctx, boardState, ctx.humanSymbol, empties);

        let centerControl = 0;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === ctx.aiSymbol) centerControl += utils.scoreCenterBias(ctx.config, i);
            if (boardState[i] === ctx.humanSymbol) centerControl -= utils.scoreCenterBias(ctx.config, i);
        }

        return (aiLines - humanLines) * 18 + (aiThreats - humanThreats) * 10 + (centerControl * 0.25);
    }

    function minimax(ctx, boardState, depth, isAiTurn, alpha, beta) {
        if (depth === 0) return evaluateState(ctx, boardState);

        const empties = utils.getEmptyCells(boardState);
        if (!empties.length) return evaluateState(ctx, boardState);

        const nextSymbol = isAiTurn ? ctx.aiSymbol : ctx.humanSymbol;
        const branchLimit = isAiTurn ? 7 : 6;
        const candidates = utils.topCandidatesByHeuristic(ctx, boardState, empties, branchLimit);

        if (isAiTurn) {
            let value = -Infinity;
            for (let i = 0; i < candidates.length; i++) {
                const nextBoard = utils.applyMove(boardState, candidates[i], nextSymbol);
                value = Math.max(value, minimax(ctx, nextBoard, depth - 1, false, alpha, beta));
                alpha = Math.max(alpha, value);
                if (beta <= alpha) break;
            }
            return value;
        }

        let value = Infinity;
        for (let i = 0; i < candidates.length; i++) {
            const nextBoard = utils.applyMove(boardState, candidates[i], nextSymbol);
            value = Math.min(value, minimax(ctx, nextBoard, depth - 1, true, alpha, beta));
            beta = Math.min(beta, value);
            if (beta <= alpha) break;
        }
        return value;
    }

    window.ArcadeAiProfiles['#'] = function bossHash(ctx) {
        const winMove = utils.findImmediateLineMove(ctx, ctx.aiSymbol);
        if (winMove >= 0) return winMove;

        const blockMove = utils.findImmediateLineMove(ctx, ctx.humanSymbol);
        if (blockMove >= 0) return blockMove;

        const rootMoves = utils.topCandidatesByHeuristic(ctx, ctx.board, ctx.candidates, 9);
        let bestMove = rootMoves[0];
        let bestScore = -Infinity;

        for (let i = 0; i < rootMoves.length; i++) {
            const idx = rootMoves[i];
            const nextBoard = utils.applyMove(ctx.board, idx, ctx.aiSymbol);
            const score = minimax(ctx, nextBoard, 2, false, -Infinity, Infinity);
            if (score > bestScore) {
                bestScore = score;
                bestMove = idx;
            }
        }

        return bestMove;
    };
})();

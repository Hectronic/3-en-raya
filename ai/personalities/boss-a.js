(function () {
    const utils = window.ArcadeAiUtils;

    window.ArcadeAiProfiles['A'] = function bossTriangle(ctx) {
        const winMove = utils.findImmediateLineMove(ctx, ctx.aiSymbol);
        if (winMove >= 0) return winMove;

        const blockMove = utils.findImmediateLineMove(ctx, ctx.humanSymbol);
        if (blockMove >= 0) return blockMove;

        let bestMove = ctx.candidates[0];
        let bestScore = -Infinity;

        for (let i = 0; i < ctx.candidates.length; i++) {
            const idx = ctx.candidates[i];
            const nextBoard = utils.applyMove(ctx.board, idx, ctx.aiSymbol);
            const empties = utils.getEmptyCells(nextBoard);

            const aiLines = ctx.getLineCount(nextBoard, ctx.aiSymbol);
            const humanLines = ctx.getLineCount(nextBoard, ctx.humanSymbol);
            const aiDoubleThreat = utils.countImmediateLineMoves(ctx, nextBoard, ctx.aiSymbol, empties);
            const humanDoubleThreat = utils.countImmediateLineMoves(ctx, nextBoard, ctx.humanSymbol, empties);
            const ownAdj = utils.countAdjacent(ctx.board, ctx.config, idx, ctx.aiSymbol);
            const centerBias = utils.scoreCenterBias(ctx.config, idx);

            const score =
                (aiLines * 10) -
                (humanLines * 8) +
                (aiDoubleThreat * 6) -
                (humanDoubleThreat * 7.5) +
                (ownAdj * 1.6) +
                (centerBias * 0.3);

            if (score > bestScore) {
                bestScore = score;
                bestMove = idx;
            }
        }

        return bestMove;
    };
})();

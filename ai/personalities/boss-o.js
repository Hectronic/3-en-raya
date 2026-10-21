(function () {
    const utils = window.ArcadeAiUtils;

    window.ArcadeAiProfiles['O'] = function bossO(ctx) {
        const winMove = utils.findImmediateLineMove(ctx, ctx.aiSymbol);
        if (winMove >= 0) return winMove;

        const blockMove = utils.findImmediateLineMove(ctx, ctx.humanSymbol);
        if (blockMove >= 0) return blockMove;

        const center = utils.getCenterIndex(ctx.config);
        if (ctx.board[center] === null) return center;

        let bestMove = ctx.candidates[0];
        let bestScore = -Infinity;

        for (let i = 0; i < ctx.candidates.length; i++) {
            const idx = ctx.candidates[i];
            const nextBoard = utils.applyMove(ctx.board, idx, ctx.aiSymbol);
            const empties = utils.getEmptyCells(nextBoard);

            const aiThreats = utils.countImmediateLineMoves(ctx, nextBoard, ctx.aiSymbol, empties);
            const humanThreats = utils.countImmediateLineMoves(ctx, nextBoard, ctx.humanSymbol, empties);
            const ownAdj = utils.countAdjacent(ctx.board, ctx.config, idx, ctx.aiSymbol);
            const centerBias = utils.scoreCenterBias(ctx.config, idx);

            const score = (aiThreats * 4.4) - (humanThreats * 5.2) + (ownAdj * 1.8) + (centerBias * 0.4);
            if (score > bestScore) {
                bestScore = score;
                bestMove = idx;
            }
        }

        return bestMove;
    };
})();

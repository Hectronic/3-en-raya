(function () {
    const utils = window.ArcadeAiUtils;

    function evaluateState(ctx, boardState) {
        const empties = utils.getEmptyCells(boardState);
        const aiLines = ctx.getLineCount(boardState, ctx.aiSymbol);
        const humanLines = ctx.getLineCount(boardState, ctx.humanSymbol);
        const aiThreats = utils.countImmediateLineMoves(ctx, boardState, ctx.aiSymbol, empties);
        const humanThreats = utils.countImmediateLineMoves(ctx, boardState, ctx.humanSymbol, empties);
        return (aiLines - humanLines) * 15 + (aiThreats - humanThreats) * 9;
    }

    window.ArcadeAiProfiles['@'] = function bossAt(ctx) {
        const winMove = utils.findImmediateLineMove(ctx, ctx.aiSymbol);
        if (winMove >= 0) return winMove;

        const blockMove = utils.findImmediateLineMove(ctx, ctx.humanSymbol);
        if (blockMove >= 0) return blockMove;

        const topMoves = utils.topCandidatesByHeuristic(ctx, ctx.board, ctx.candidates, 10);
        let bestMove = topMoves[0];
        let bestWorstScore = -Infinity;

        for (let i = 0; i < topMoves.length; i++) {
            const aiMove = topMoves[i];
            const boardAfterAi = utils.applyMove(ctx.board, aiMove, ctx.aiSymbol);
            const humanRepliesAll = utils.getEmptyCells(boardAfterAi);
            const humanReplies = utils.topCandidatesByHeuristic(ctx, boardAfterAi, humanRepliesAll, 8);

            let worstCase = Infinity;
            for (let j = 0; j < humanReplies.length; j++) {
                const humanMove = humanReplies[j];
                const boardAfterHuman = utils.applyMove(boardAfterAi, humanMove, ctx.humanSymbol);
                const stateScore = evaluateState(ctx, boardAfterHuman);
                if (stateScore < worstCase) worstCase = stateScore;
            }

            const immediateScore = evaluateState(ctx, boardAfterAi) * 0.35;
            const combinedScore = (worstCase === Infinity ? 0 : worstCase) + immediateScore;

            if (combinedScore > bestWorstScore) {
                bestWorstScore = combinedScore;
                bestMove = aiMove;
            }
        }

        return bestMove;
    };
})();

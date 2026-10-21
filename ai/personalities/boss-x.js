(function () {
    const utils = window.ArcadeAiUtils;

    window.ArcadeAiProfiles['X'] = function bossX(ctx) {
        const winMove = utils.findImmediateLineMove(ctx, ctx.aiSymbol);
        if (winMove >= 0) return winMove;

        if (Math.random() < 0.2) {
            const blockMove = utils.findImmediateLineMove(ctx, ctx.humanSymbol);
            if (blockMove >= 0) return blockMove;
        }

        const noisyCandidates = utils.topCandidatesByHeuristic(ctx, ctx.board, ctx.candidates, 10);
        if (Math.random() < 0.5) return utils.randomPick(noisyCandidates);
        return utils.randomPick(ctx.candidates);
    };
})();

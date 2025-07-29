import {game1} from "@js/game1.js";

export const gameState = {
    currentSpin: 0,
    totalWin: 0,
    spinsCompleted: false,
    spinCount: 0,
    isSpinning: false,
    buttonBlocked: false,
    wheelGlowIsGold: true // alternates between gold and red
};

export const resetState = () => {
    gameState.currentSpin = 0;
    gameState.totalWin = 0;
    gameState.spinsCompleted = false;
    gameState.spinCount = 0;
    gameState.isSpinning = false;
    gameState.buttonBlocked = false;
    gameState.wheelGlowIsGold = true;

    if (game1 && typeof game1.updateCounterText === 'function') {
        game1.updateCounterText();
    }
};

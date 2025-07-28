import {gameState, resetState} from './state.js';
import {gsap} from 'gsap';
import {Animations1} from './animations1.js';
import {SpriteManager} from './sprite-manager.js';
import {FireSpriteManager} from './fire-sprite-manager.js';
import {DragonAnimations} from './dragon-animations.js';

import buttonSpin from '../images/button_spin.png';
import buttonSpinHover from '../images/button_spin_hover.png';

export class Game1 {
    constructor() {
        this.wheelElement = document.querySelector('.wheel-image');
        this.spinButton = document.getElementById('spin-button');
        this.defaultButtonSrc = buttonSpin;
        this.hoverButtonSrc = buttonSpinHover;
        this.winTextElement = document.querySelector('.win-text');
        this.winSectorElement = document.querySelector('.win-sector');
        this.counterTextElement = document.querySelector('.counter-text');
        this.counterElement = document.querySelector('.counter');

        this.spriteManager = new SpriteManager();
        this.spriteManager.initialize();

        this.fireSpriteManager = new FireSpriteManager();
        this.fireSpriteManager.initialize();

        this.createModal();
        this.initEventListeners();
        this.initializeWheel();
        this.startButtonShake();
        this.updateCounterText();
    }

    createModal() {
        if (!document.querySelector('.modal-overlay')) {
            const modalHTML = `
               <div class="modal-overlay">
                   <div class="modal-content">
                       <div class="modal-win-amount"></div>
                       <a href="{offer_link}" target="_blank" class="modal-button"></a>
                   </div>
               </div>
           `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        this.modal = document.querySelector('.modal-overlay');
    }

    showWinText(text) {
        if (this.winTextElement) {
            this.winTextElement.textContent = text;
            this.winTextElement.classList.add('active');
        }
        if (this.winSectorElement) {
            this.winSectorElement.classList.add('active');
        }
    }

    hideWinText() {
        if (this.winTextElement) {
            this.winTextElement.classList.remove('active');
        }
        if (this.winSectorElement) {
            this.winSectorElement.classList.remove('active');
        }
    }

    startButtonShake() {
    }

    stopButtonShake() {
    }

    initEventListeners() {

        // Click anywhere on screen to spin
        document.addEventListener('click', (e) => {
            if (!gameState.buttonBlocked && !e.target.closest('.modal-content') && !e.target.closest('#language-selector')) {
                this.triggerButtonPress();
            }
        });

        // Keyboard events for space and enter
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !gameState.buttonBlocked) {
                e.preventDefault();
                this.triggerButtonPress();
            }
        });

        const modalButton = document.querySelector('.modal-button');
        if (modalButton) {
            modalButton.addEventListener('click', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.spriteManager.stop();
                    this.hideWinText();
                    Animations1.hideModal(this.modal);
                    resetState();
                }
            });
        }
    }

    initializeWheel() {
        Animations1.wheelSpin(this.wheelElement, 0, 0);
    }

    updateCounterText() {
        if (this.counterTextElement) {
            const remainingSpins = 2 - gameState.spinCount;
            this.counterTextElement.textContent = remainingSpins > 0 ? remainingSpins : 0;
        }
    }

    triggerButtonPress() {
        if (gameState.isSpinning || gameState.buttonBlocked) return;
        
        
        this.hideWinText();
        this.spin();
    }

    spin() {
        if (gameState.isSpinning || gameState.buttonBlocked) return;

        gameState.buttonBlocked = true;
        gameState.spinCount++;
        gameState.isSpinning = true;
        
        // Add pressed state to button
        const spinButtonImage = document.querySelector('.spin-button-image');
        if (spinButtonImage) {
            spinButtonImage.classList.add('pressed');
        }

        this.updateCounterText();

        this.spriteManager.reset();

        const dragonsElement = document.querySelector('.logo02.dragons');
        if (dragonsElement) {
            dragonsElement.style.animation = 'none';
        }

        const currentRotation = gsap.getProperty(this.wheelElement, "rotation") || 0;
        const spinPromise = Animations1.wheelSpin(this.wheelElement, currentRotation, gameState.spinCount);

        let spinHandled = false;

        spinPromise.then(() => {
            if (spinHandled) return;
            spinHandled = true;

            gameState.isSpinning = false;
            
            // Remove pressed state from button
            const spinButtonImage = document.querySelector('.spin-button-image');
            if (spinButtonImage) {
                spinButtonImage.classList.remove('pressed');
            }

            if (gameState.spinCount === 2) {
                gameState.buttonBlocked = true;
            }

            this.spriteManager.play(1, -1);

            this.fireSpriteManager.flash();

            if (dragonsElement) {
                DragonAnimations.startDragonsPulsation(dragonsElement);
            }

            if (gameState.spinCount === 1) {
                this.showWinText('100FS');
                setTimeout(() => {
                    gameState.buttonBlocked = false;
                    this.startButtonShake();
                }, 1000);
            } else if (gameState.spinCount === 2) {
                this.showWinText('300%');
                setTimeout(() => {
                    this.spriteManager.stop();
                    Animations1.showModal(this.modal);
                }, 1500);
            }
        });

        return spinPromise;
    }
}


export const game1 = new Game1();

import { State } from '../types';
import { BaseUi } from './BaseUi';

export class PopupUiHelper extends BaseUi {
    constructor(state: State) {
        super(state);
    }

    loadBaseUi(): void {
        this.setActiveNavButton();
        this.setActiveScreen();
    }

    private setActiveNavButton(): void {
        const className = super.getActiveNavButtonClass();
        if (className === null) {
            super.setActiveNavButtonClass('playerNavButton');
            this.setActiveNavButton();
        } else {
            document.querySelector(`.${className}`)!.classList.add('active');
        }
    }

    private setActiveScreen(): void {
        const className = super.getActiveScreenClass();
        if (className === null) {
            super.setActiveScreenClass('playerScreen');
            this.setActiveScreen();
        } else {
            const main = document.querySelector('.main')!;
            const screensList = main.children;
            for (let i = 0; i < screensList.length; i++) {
                const screen = screensList[i];
                screen.classList.remove('active');
            }
            document.querySelector(`.${className}`)!.classList.add('active');
        }
    }
}

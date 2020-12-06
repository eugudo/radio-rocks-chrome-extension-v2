import { State } from '../types';

export class BaseUi {
    state: State;
    private activeNavButton: string | null;
    private activeScreen: string | null;

    constructor(state: State) {
        this.state = state;
        this.activeNavButton = state.getLastActiveNavButtonClass();
        this.activeScreen = state.getLastActiveScreenClass();
    }

    getActiveNavButtonClass() {
        return this.activeNavButton;
    }

    setActiveNavButtonClass(className: string) {
        this.activeNavButton = className;
        this.state.setLastActiveNavButtonClass(className);
    }

    getActiveScreenClass() {
        return this.activeScreen;
    }

    setActiveScreenClass(className: string) {
        this.activeScreen = className;
        this.state.setLastActiveScreenClass(className);
    }

    getChromeStorageData<T>(key: string): Promise<T | void> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(key, (response: Record<string, T | void>) => {
                resolve(response[key]);
            });
        });
    }

    setChromeStorageData<T>(key: Record<string, T>): void {
        chrome.storage.sync.set(key);
    }
}

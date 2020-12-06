import { State } from '../types';
import { player } from './player';
import { channelInfo } from './channelInfo';

export const appState: State = {
    lastActiveNavButtonClass: '',
    lastActiveScreenClass: '',
    getLastActiveNavButtonClass(): string | null {
        return this.lastActiveNavButtonClass === '' ? null : this.lastActiveNavButtonClass;
    },
    setLastActiveNavButtonClass(className: string): void {
        this.lastActiveNavButtonClass = className;
    },
    getLastActiveScreenClass(): string | null {
        return this.lastActiveScreenClass === '' ? null : this.lastActiveScreenClass;
    },
    setLastActiveScreenClass(className: string): void {
        this.lastActiveScreenClass = className;
    },
    player,
    channelInfo,
};

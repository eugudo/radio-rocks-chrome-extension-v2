import { getChromeStorageData } from '../common/chromeStorageMethods';
import { Settings } from '../common/Settings';
import { Channel } from '../types';
import { Player } from '../types';
import { channelsList } from './channelsList';

export const player: Player = {
    isPlaying: false,
    audio: <HTMLAudioElement>document.getElementById('audio')!,
    getPlayingStatus(): boolean {
        return this.isPlaying;
    },
    setPlayingStatus(bool: boolean): void {
        if (bool) {
            const lastActiveChannelPromise = getChromeStorageData<Channel>(Settings.LastActiveChannel);
            lastActiveChannelPromise.then((response) => {
                if (!response) {
                    this.audio.src = channelsList[0].channelUrl;
                } else {
                    this.audio.src = response.channelUrl;
                }
                this.setBudgeDisplay(true);
                this.isPlaying = bool;
                this.audio.play();
                return;
            })
        }
        this.setBudgeDisplay()
        this.isPlaying = bool;
        this.audio.pause();
        this.audio.src = '';
    },
    setCurrentVolumeLevel(level: number): void {
        this.audio.volume = level / 100;
    },
    getCurrentVolumeLevel(): number {
        return this.audio.volume;
    },
    switchChannel(channel: Channel): void {
        this.audio.src = channel.channelUrl;
        if (this.isPlaying) {
            this.setPlayingStatus(false);
            this.setPlayingStatus(true);
        }
    },
    setBudgeDisplay(bool: boolean = false) {
        if (bool) {
            chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
            chrome.browserAction.setBadgeText({ text: 'air' });
            return;
        }
        chrome.browserAction.setBadgeText({ text: '' });
    }

};

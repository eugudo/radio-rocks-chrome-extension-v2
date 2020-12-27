import { Settings } from '../common/Settings';
import { Bookmark } from '../types';
import { Channel } from '../types';
import { VolumeLevel } from '../types';
import { State } from '../types';
import { BaseUi } from './BaseUi';
import { EventsManager } from './EventsManager';

export class ContentManager extends BaseUi {
    constructor(state: State) {
        super(state);
    }

    setPageContent(): void {
        this.setPlayStopButtonStatus();
        this.setChannelsList();
        this.setHeaderTitles();
        this.setVolumeLevel();
        this.setFooterChannelTitle();
        this.setBookmarks();
    }

    private setHeaderTitles(): void {
        document.querySelector('.header__websiteLink')!.setAttribute('title', chrome.i18n.getMessage('goToWebsite'));
        document.querySelector('.playerNavButton')!.setAttribute('title', chrome.i18n.getMessage('playerButtonTitle'));
        document
            .querySelector('.channelsNavButton')!
            .setAttribute('title', chrome.i18n.getMessage('channelsButtonTitle'));
        document
            .querySelector('.bookmarksNavButton')!
            .setAttribute('title', chrome.i18n.getMessage('bookmarksButtonTitle'));
    }

    setFooterChannelTitle(): void {
        const lastActiveChannelPromise = super.getChromeStorageData<Channel>(Settings.LastActiveChannel);
        lastActiveChannelPromise.then((response) => {
            if (response) {
                document.querySelector('.footer__currentChannelTitle')!.textContent = String(response.channelName);
            }
        });
    }

    private setVolumeLevel(): void {
        const volumeElem = document.querySelector('.volumeLevel')!;
        const volumeLevelPromise = this.getChromeStorageData<VolumeLevel>(Settings.VolumeLevel);
        volumeLevelPromise.then((response) => {
            if (!response) {
                volumeElem.setAttribute('value', '100');
                return;
            }
            volumeElem.setAttribute('value', String(response.current));
            const eventsManager = new EventsManager(this.state);
            eventsManager.setVolumeIconValue(response.current);
        });
    }

    private setChannelsList(): void {
        const ul = document.querySelector('.channelsScreen')!;
        const template = <HTMLTemplateElement>document.querySelector('#channelItemTemplate')!;
        const channelsListPromise = this.getChromeStorageData<Channel[]>(Settings.ChannelsList);
        const lastActiveChannelPromise = this.getChromeStorageData<Channel>(Settings.LastActiveChannel);
        Promise.all([channelsListPromise, lastActiveChannelPromise]).then((response) => {
            if (response[0] === undefined || response[1] === undefined) {
                return;
            }
            const lastActiveChannel = response[1];
            Object.values(response[0])
                .sort((channel1, channel2) => channel1.order - channel2.order)
                .forEach((channel) => {
                    const clone = <HTMLElement>template.content.cloneNode(true);
                    const li = <HTMLElement>clone.querySelector('.channelsScreen__item')!;
                    if (channel.channelName === lastActiveChannel.channelName) {
                        li.classList.add('active');
                    }
                    li.innerText = channel.channelName;
                    li.setAttribute('data-url', channel.channelUrl);
                    li.setAttribute('title', chrome.i18n.getMessage('channelsTitle'));
                    ul.append(li);
                });
        });
    }

    private setPlayStopButtonStatus(): void {
        const playing = this.state.player.getPlayingStatus();
        if (playing && super.getActiveScreenClass() === 'playerScreen') {
            document.querySelector('.playStopButton')!.classList.toggle('playing');
            return;
        }
        document.querySelector('.playStopButton')!.classList.remove('playing');
    }

    setBookmarks(): void {
        const ul = document.querySelector('.bookmarks')!;
        ul.innerHTML = '';
        const template = <HTMLTemplateElement>document.querySelector('#bookmarksItemTemplate')!;
        const bookmarksListPromise = this.getChromeStorageData<Bookmark[]>(Settings.BookmarksList);
        bookmarksListPromise.then((response) => {
            if (response === undefined) {
                return;
            }
            Object.values(response).forEach((bookmark) => {
                const clone = <HTMLElement>template.content.cloneNode(true);
                const li = clone.querySelector('.bookmarks__item')!;
                const img = clone.querySelector('.bookmarks__itemImage')!;
                const h2 = <HTMLElement>clone.querySelector('.bookmarks__itemSinger')!;
                const span = <HTMLElement>clone.querySelector('.bookmarks__itemSong')!;
                li.setAttribute('data-timestamp', bookmark.timestamp);
                img.setAttribute('src', bookmark.coverUrl);
                img.setAttribute('alt', bookmark.songAuthor);
                h2.innerText = bookmark.songAuthor;
                span.innerText = bookmark.songTitle;
                ul.append(clone);
            });
        });
    }

    setSongInfo(): void {
        const songInfo = document.querySelector('.songInfo')!;
        const bookmarkButton = document.querySelector('.songInfo__likeButton')!;
        const activated = songInfo.classList.contains('active');
        if (activated && this.state.channelInfo.currentTime === null) {
            songInfo.classList.remove('active');
            return;
        }
        if (!this.state.player.getPlayingStatus()) {
            if (activated) {
                songInfo.classList.remove('active');
            }
            return;
        }
        if (!activated && this.state.channelInfo.currentTime !== null) {
            songInfo.classList.add('active');
        }
        const singerTitle = songInfo.querySelector('.songInfo__singer')!;
        const songTitle = songInfo.querySelector('.songInfo__song')!;
        const singer = this.state.channelInfo.singerName;
        const song = this.state.channelInfo.songName;
        singerTitle.textContent = singer;
        songTitle.textContent = song;
        const bookmarksPromise = this.getChromeStorageData<Bookmark[]>(Settings.BookmarksList);
        bookmarksPromise.then((bookmarksList) => {
            if (!bookmarksList) {
                return;
            }
            const isExistSong = bookmarksList.find(
                (bookmark) => bookmark.songAuthor === singer && bookmark.songTitle === song
            );
            if (isExistSong && !bookmarkButton.classList.contains('active')) {
                bookmarkButton.classList.add('active');
            } else if (!isExistSong && bookmarkButton.classList.contains('active')) {
                bookmarkButton.classList.remove('active');
            }
        });
    }
}

import { Settings } from '../common/Settings';
import { Bookmark } from '../types';
import { Channel } from '../types';
import { VolumeLevel } from '../types';
import { State } from '../types';
import { BaseUi } from './BaseUi';
import { ContentManager } from './ContentManager';

export class EventsManager extends BaseUi {
    constructor(state: State) {
        super(state);
    }

    addHandlers() {
        document.querySelector('.navigation')!.addEventListener('click', this.changeNav.bind(this));
        document.querySelector('.playStopButton')!.addEventListener('click', this.changePlayingState.bind(this));
        document.querySelector('.volumeLevel')!.addEventListener('click', this.changeVolumeLevel.bind(this));
        document.querySelector('.speakerIcon')!.addEventListener('click', this.muteAudio.bind(this));
        document.querySelector('.channelsScreen')!.addEventListener('click', this.switchChannel.bind(this));
        document.querySelector('.bookmarks')!.addEventListener('click', this.removeBookmarkFromList.bind(this));
        document.querySelector('.songInfo__likeButton')!.addEventListener('click', this.addOrRemoveBookmark.bind(this));
    }

    changeNav(event: MouseEvent) {
        const navButton: HTMLButtonElement | null = (event.target as Element).closest('button');
        if (navButton === null || navButton.classList.contains('active')) {
            return;
        }
        document.querySelectorAll('.navigation__button')!.forEach((element) => element.classList.remove('active'));
        navButton.classList.add('active');
        const activeNavButtonCassName = navButton.className.split(' ')[1];
        super.setActiveNavButtonClass(activeNavButtonCassName);
        const activeScreenClass = this.getCurrentScreenClassName();
        super.setActiveScreenClass(activeScreenClass);
        const main = document.querySelector('.main')!;
        const screensList = main.children;
        for (let i = 0; i < screensList.length; i++) {
            const screen = screensList[i];
            screen.classList.remove('active');
        }
        document.querySelector(`.${activeScreenClass}`)!.classList.add('active');
        this.setActiveElements();
    }

    getCurrentScreenClassName(): string {
        switch (super.getActiveNavButtonClass()) {
            case 'playerNavButton':
                return 'playerScreen';
            case 'channelsNavButton':
                return 'channelsScreen';
            case 'bookmarksNavButton':
                return 'bookmarksScreen';
            default:
                return '';
        }
    }

    setActiveElements() {
        if (super.getActiveScreenClass() === 'playerScreen') {
            const playStopButton = document.querySelector('.playStopButton')!;
            if (!playStopButton.classList.contains('playing') && this.state.player.getPlayingStatus()) {
                playStopButton.classList.toggle('playing');
            }
        }
    }

    changePlayingState(event: MouseEvent) {
        const playPauseButton: HTMLButtonElement | null = (event.target as Element).closest('button')!;
        if (playPauseButton === null) {
            return;
        }
        playPauseButton.classList.toggle('playing');
        if (this.state.player.getPlayingStatus()) {
            this.state.player.setPlayingStatus(false);
            return;
        }
        this.state.player.setPlayingStatus(true);
    }

    changeVolumeLevel(event: MouseEvent) {
        const volumeElem = document.querySelector('.volumeLevel')!;
        let percent = Math.round((event.offsetX / volumeElem.getBoundingClientRect().width) * 100);
        percent > 95 ? percent = 100 : percent;
        const volumeLevelPromise = super.getChromeStorageData<VolumeLevel>(Settings.VolumeLevel);
        volumeLevelPromise.then((response: void | VolumeLevel) => {
            if (response) {
                if (percent === response.current) {
                    return;
                }
                const volumeLevel: VolumeLevel = {
                    current: percent,
                    last: response.current,
                }
                this.state.player.setCurrentVolumeLevel(percent);
                super.setChromeStorageData<VolumeLevel>({ [Settings.VolumeLevel]: volumeLevel });
                volumeElem.setAttribute('value', `${percent}`);
                this.setVolumeIconValue(percent);
            }
        });
    }

    setVolumeIconValue(percent: number) {
        const speakerIcon = document.querySelector('.speakerIcon')!;
        if (percent === 0) {
            speakerIcon.classList.add('muted');
            return;
        } else if (percent > 0 && percent < 30) {
            speakerIcon.classList.remove('muted');
            speakerIcon.classList.remove('medium');
            if (!speakerIcon.classList.contains('min')) {
                speakerIcon.classList.add('min');
            }
            return;
        } else if (percent > 30 && percent < 70) {
            speakerIcon.classList.remove('muted');
            speakerIcon.classList.remove('min');
            if (!speakerIcon.classList.contains('medium')) {
                speakerIcon.classList.add('medium');
            }
            return;
        } else if (percent > 70) {
            speakerIcon.classList.remove('muted');
            speakerIcon.classList.remove('min');
            speakerIcon.classList.remove('medium');
        }
        return;
    }

    muteAudio() {
        const volumeElem = document.querySelector('.volumeLevel')!;
        const volumeLevelPromise = super.getChromeStorageData<VolumeLevel>(Settings.VolumeLevel);
        volumeLevelPromise.then((response: void | VolumeLevel) => {
            if (response) {
                if (this.state.player.getCurrentVolumeLevel() === 0) {
                    this.state.player.setCurrentVolumeLevel(response.last);
                    super.setChromeStorageData<VolumeLevel>({ [Settings.VolumeLevel]: {current: response.last, last: response.last} });
                    volumeElem.setAttribute('value', String(response.last));
                    this.setVolumeIconValue(response.last);
                } else {
                    this.state.player.setCurrentVolumeLevel(0);
                    super.setChromeStorageData<VolumeLevel>({ [Settings.VolumeLevel]: {current: 0, last: response.current} });
                    volumeElem.setAttribute('value', '0');
                    this.setVolumeIconValue(0);
                }
            }
        });
    }

    switchChannel(event: MouseEvent): void {
        const li: HTMLElement | null = (event.target as Element).closest('li')!;
        if (li === null) {
            return;
        }
        const url = li.getAttribute('data-url');
        if (url === null) {
            return;
        }
        const lastActiveChannelPromise = super.getChromeStorageData<Channel>(Settings.LastActiveChannel);
        lastActiveChannelPromise.then((response) => {
            if (response === undefined || response.channelUrl === url) {
                return;
            }
            const channelsListPromise = super.getChromeStorageData<Channel[]>(Settings.ChannelsList);
            channelsListPromise.then((response) => {
                if (response === undefined) {
                    return;
                }
                const newChannel = Object.values(response).find((channel) => channel.channelUrl === url)!;
                document
                    .querySelector('.channelsScreen')!
                    .querySelectorAll('li')
                    .forEach((elem) => elem.classList.remove('active'));
                li.classList.add('active');
                this.setChromeStorageData<Channel>({ [Settings.LastActiveChannel]: newChannel });
                const contentManager = new ContentManager(this.state);
                contentManager.setFooterChannelTitle();
                this.state.player.switchChannel(newChannel);
            });
        });
    }

    removeBookmarkFromList(event: MouseEvent): void {
        const target = <HTMLElement>event.target!;
        if (!target.classList.contains('bookmarks__itemDeleteButton')) {
            return;
        }
        const bookmarkItem: HTMLLIElement | null = (event.target as Element).closest('li');
        if (bookmarkItem === null) {
            return;
        }
        const timestamp = bookmarkItem.getAttribute('data-timestamp');
        if (timestamp === null) {
            return;
        }
        const bookmarksPromise = super.getChromeStorageData<Bookmark[]>(Settings.BookmarksList);
        bookmarksPromise.then((bookmarksList) => {
            if (!bookmarksList) {
                return;
            }
            const filteredBookmarks = bookmarksList.filter((bookmark) => bookmark.timestamp !== timestamp);
            this.setChromeStorageData<Bookmark[]>({ [Settings.BookmarksList]: filteredBookmarks });
        });
        bookmarkItem.remove();
    }

    addOrRemoveBookmark(event: MouseEvent): void {
        const bookmarkButton: HTMLButtonElement | null = (event.target as Element).closest('button')!;
        const songAuthor = this.state.channelInfo.singerName;
        const songTitle = this.state.channelInfo.songName;
        if (!this.state.player.getPlayingStatus() || songAuthor === '') {
            return;
        }
        const newBookmark: Bookmark = {
            songAuthor,
            songTitle,
            coverUrl: this.state.channelInfo.coverUrl !== '' ? this.state.channelInfo.coverUrl : 'img/icon128.png',
            timestamp: new Date().getTime().toString(),
        };
        const bookmarksPromise = super.getChromeStorageData<Bookmark[]>(Settings.BookmarksList);
        bookmarksPromise.then((bookmarksList) => {
            if (!bookmarksList) {
                return;
            }
            const isDouble = bookmarksList.some(
                (bookmark) =>
                    bookmark.songAuthor === newBookmark.songAuthor && bookmark.songTitle === newBookmark.songTitle
            );
            if (!isDouble) {
                if (!bookmarkButton.classList.contains('active')) {
                    bookmarkButton.classList.add('active');
                    this.shakeButton(Settings.BookmarksList);
                }
                bookmarksList.push(newBookmark);
                this.setChromeStorageData<Bookmark[]>({ [Settings.BookmarksList]: bookmarksList });
                const pageContentManager = new ContentManager(this.state);
                pageContentManager.setBookmarks();
            } else {
                const newBookmarksList = bookmarksList.filter(
                    (bookmark) =>
                        bookmark.songAuthor !== newBookmark.songAuthor && bookmark.songTitle !== newBookmark.songTitle
                );
                if (bookmarkButton.classList.contains('active')) {
                    bookmarkButton.classList.remove('active');
                    this.shakeButton();
                }
                bookmarksList = newBookmarksList;
                this.setChromeStorageData<Bookmark[]>({ [Settings.BookmarksList]: bookmarksList });
                const pageContentManager = new ContentManager(this.state);
                pageContentManager.setBookmarks();
            }
        });
    }

    shakeButton(settings?: Settings) {
        document.querySelectorAll('.navigation__button')!.forEach((element) => element.classList.remove('shake'));
        if (settings === Settings.BookmarksList) {
            setTimeout(() => {
                document.querySelector('.bookmarksNavButton')!.classList.add('shake');
            }, 200) 
        } else {
            document.querySelectorAll('.navigation__button')!.forEach((element) => element.classList.remove('shake'));
        }
    }
}

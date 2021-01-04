import { appState } from './backgroundPage/appState';
import { channelsList } from './backgroundPage/channelsList';
import { LastActiveChannel } from './backgroundPage/channelsList';
import { setSrcToAudioElement } from './backgroundPage/setSrcToAudioElement';
import { getChromeStorageData } from './common/chromeStorageMethods';
import { setChromeStorageData } from './common/chromeStorageMethods';
import { Settings } from './common/Settings';
import { Bookmark } from './types';
import { Channel } from './types';
import { VolumeLevel } from './types';
import { ChannelInfoUpdater } from './backgroundPage/ChannelInfoUpdater';

document.addEventListener('DOMContentLoaded', () => initializeBackgroundPage());

const initializeBackgroundPage = (): void => {
    const newestVersion = chrome.runtime.getManifest().version === '1.0.2';
    appState.player.setBudgeDisplay();
    const channelsListPromise = getChromeStorageData<Channel[]>(Settings.ChannelsList);
    const bookmarksListPromise = getChromeStorageData<Bookmark[]>(Settings.BookmarksList);
    const lastActiveChannelPromise = getChromeStorageData<Channel>(Settings.LastActiveChannel);
    const volumeLevelPromise = getChromeStorageData<VolumeLevel>(Settings.VolumeLevel);
    Promise.all([channelsListPromise, bookmarksListPromise, lastActiveChannelPromise, volumeLevelPromise]).then(
        (values) => {
            if (!values[0] || newestVersion) {
                setChromeStorageData({ [Settings.ChannelsList]: channelsList });
            }
            if (!values[1]) {
                setChromeStorageData({ [Settings.BookmarksList]: [] });
            }
            if (!values[2]) {
                setChromeStorageData({ [Settings.LastActiveChannel]: LastActiveChannel });
            }
            if (!values[3]) {
                const volumeLevel: VolumeLevel = {
                    current: 100,
                    last: 100,
                }
                setChromeStorageData({ [Settings.VolumeLevel]: volumeLevel });
            }
            setSrcToAudioElement();
        }
    );
    if (!window.getState) {
        window.getState = (): any => appState;
    }
    const channelInfoUpdater = new ChannelInfoUpdater(appState);
    setInterval(() => channelInfoUpdater.updateChannelInfo(), 5000);
};

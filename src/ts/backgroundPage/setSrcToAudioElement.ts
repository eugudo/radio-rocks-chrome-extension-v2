import { getChromeStorageData } from '../common/chromeStorageMethods';
import { Settings } from '../common/Settings';
import { Channel } from '../types';

export const setSrcToAudioElement = (src?: string): void => {
    const audioElement = document.getElementById('audio')!;
    if (src) {
        audioElement.setAttribute('src', src);
        return;
    }
    const lastActiveChannelPromise = getChromeStorageData<Channel>(Settings.LastActiveChannel);
    lastActiveChannelPromise.then((response) => {
        if (!response) {
            return;
        }
        audioElement.setAttribute('src', response.channelUrl);
    });
};

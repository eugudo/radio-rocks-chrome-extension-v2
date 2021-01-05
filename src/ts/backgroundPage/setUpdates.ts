import { getChromeStorageData } from '../common/chromeStorageMethods';
import { setChromeStorageData } from '../common/chromeStorageMethods';
import { Settings } from '../common/Settings';
import { AppVersion } from './../types';
import { channelsList } from './../backgroundPage/channelsList';

export const setUpdates = () => {
    const manifestAppVersion = chrome.runtime.getManifest().version;
    const getLastAppVersion = getChromeStorageData<AppVersion>('currentVersion');

    getLastAppVersion.then((response) => {
        if (!response) {
            setChromeStorageData({ currentVersion: manifestAppVersion });
        } else {
            const lastAppVersion = response.version;
            const alreadyUpdated = manifestAppVersion === lastAppVersion;
            if (alreadyUpdated) {
                return
            }
            setChromeStorageData({ [Settings.ChannelsList]: channelsList });
        }
    });
}

import { getChromeStorageData } from '../common/chromeStorageMethods';
import { Settings } from '../common/Settings';
import { BaseChannelInfoDTO } from '../types';
import { Channel } from '../types';
import { State } from '../types';
import { FullChannelInfoDTO } from '../types';

export class ChannelInfoUpdater {
    private state: State;

    constructor(state: State) {
        this.state = state;
    }

    updateChannelInfo(): void {
        if (!this.state.player.getPlayingStatus()) {
            return;
        }
        const lastActiveChannelPromise = getChromeStorageData<Channel>(Settings.LastActiveChannel);
        lastActiveChannelPromise.then((lastActiveChannel) => {
            if (!lastActiveChannel) {
                return;
            }
            const getChannelInfoPromise = this.getChannelInfo<BaseChannelInfoDTO[]>(lastActiveChannel.infoUrl);
            getChannelInfoPromise.then((channelInfo) => {
                if (!channelInfo || channelInfo.length === 0) {
                    return;
                }
                const currentInfo = channelInfo[0];
                if (lastActiveChannel.channelName !== chrome.i18n.getMessage('channelsIndiHeader')) {
                    const artistId = (currentInfo as FullChannelInfoDTO).artist_id;
                    if (artistId === 0) {
                        this.state.channelInfo.currentTime = null;
                        return;
                    }
                }
                this.state.channelInfo.currentTime = currentInfo.time;
                this.state.channelInfo.singerName = currentInfo.singer;
                this.state.channelInfo.songName = currentInfo.song;
                this.state.channelInfo.coverUrl = currentInfo.cover ? currentInfo.cover : '';
            });
        });
    }

    private getChannelInfo<T>(url: string): Promise<T> {
        return new Promise((resolve) => {
            const ajax = new XMLHttpRequest();
            ajax.open('GET', url);
            ajax.onreadystatechange = () => {
                if (ajax.readyState === 4 && ajax.status === 200) {
                    resolve(JSON.parse(ajax.responseText));
                }
            };
            ajax.send();
        });
    }
}

export interface Channel {
    alias: string;
    channelName: string;
    channelUrl: string;
    infoUrl: string;
    order: number;
}

export type Bookmark = {
    songAuthor: string;
    songTitle: string;
    coverUrl: string;
    timestamp: string;
};

export interface VolumeLevel {
    current: number;
    last: number;
}

export interface State {
    lastActiveNavButtonClass: string;
    lastActiveScreenClass: string;
    getLastActiveNavButtonClass(): string | null;
    setLastActiveNavButtonClass(className: string): void;
    getLastActiveScreenClass(): string | null;
    setLastActiveScreenClass(className: string): void;
    player: Player;
    channelInfo: ChannelInfo;
}

export interface Player {
    isPlaying: boolean;
    audio: HTMLAudioElement;
    getPlayingStatus(): boolean;
    setPlayingStatus(bool: boolean): void;
    setCurrentVolumeLevel(level: number): void;
    getCurrentVolumeLevel(): number;
    switchChannel(channel: Channel): void;
    setBudgeDisplay(bool?: boolean): void;
}

export interface ChannelInfo {
    currentTime: string | null;
    singerName: string;
    songName: string;
    coverUrl: string;
}

export interface BaseChannelInfoDTO {
    stime: string;
    time: string;
    singer: string;
    song: string;
    cover: string;
}

export interface FullChannelInfoDTO extends BaseChannelInfoDTO {
    artist_id: number;
    url?: string;
    program: string;
    song_url: string;
    video: string;
    year?: null;
}

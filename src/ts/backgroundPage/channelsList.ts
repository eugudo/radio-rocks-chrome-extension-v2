import { Channel } from '../types';

export const channelsList: Channel[] = [
    {
        alias: 'main',
        channelName: chrome.i18n.getMessage('channelsMainHeader'),
        channelUrl: 'http://online-radioroks.tavrmedia.ua/RadioROKS',
        infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=roks',
        order: 1,
    },
    {
        alias: 'ukrainian',
        channelName: chrome.i18n.getMessage('channelsUkrainianHeader'),
        channelUrl: 'http://online-radioroks.tavrmedia.ua/RadioROKS_Ukr',
        infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=roksukr',
        order: 2,
    },
    {
        alias: 'new',
        channelName: chrome.i18n.getMessage('channelsNewHeader'),
        channelUrl: 'http://online-radioroks2.tavrmedia.ua/RadioROKS_NewRock',
        infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=roksnew',
        order: 3,
    },
    {
        alias: 'hard',
        channelName: chrome.i18n.getMessage('channelsHardHeader'),
        channelUrl: 'http://online-radioroks.tavrmedia.ua/RadioROKS_HardnHeavy',
        infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=rokshar',
        order: 4,
    },
    {
        alias: 'ballads',
        channelName: chrome.i18n.getMessage('channelsBalladsHeader'),
        channelUrl: 'http://online-radioroks.tavrmedia.ua/RadioROKS_Ballads',
        infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=roksbal',
        order: 5,
    },
    {
        alias: 'indi',
        channelName: chrome.i18n.getMessage('channelsIndiHeader'),
        channelUrl: 'https://online.radioplayer.ua/RadioIndieUA_HD',
        infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=radio3indieua',
        order: 6,
    },
];

export const LastActiveChannel: Channel = {
    alias: 'main',
    channelName: chrome.i18n.getMessage('channelsMainHeader'),
    channelUrl: 'http://online-radioroks.tavrmedia.ua/RadioROKS',
    infoUrl: 'http://o.tavrmedia.ua:9561/get/?k=roks',
    order: 1,
};

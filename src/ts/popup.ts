import '../less/styles.less';
import { State } from './types';
import { PopupUiHelper } from './popupPage/PopupUiHelper';
import { ContentManager } from './popupPage/ContentManager';
import { EventsManager } from './popupPage/EventsManager';

document.addEventListener('DOMContentLoaded', () => initialize());

const initialize = (): void => {
    const backgroundPage: Window = chrome.extension.getBackgroundPage()!;
    const state = <State>backgroundPage.getState();
    const pageUi = new PopupUiHelper(state);
    pageUi.loadBaseUi();
    const pageContentManager = new ContentManager(state);
    pageContentManager.setPageContent();
    const eventsHandler = new EventsManager(state);
    eventsHandler.addHandlers();
    setInterval(() => pageContentManager.setSongInfo(), 500);
};

export const getChromeStorageData = <T>(key: string): Promise<T | void> => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, (response: Record<string, T | void>) => {
            resolve(response[key]);
        });
    });
};

export const setChromeStorageData = <T>(key: Record<string, T>): void => {
    chrome.storage.sync.set(key);
};

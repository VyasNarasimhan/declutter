/* global chrome */

export default {
    
    async startTimer() {
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            await chrome.storage.local.set({'currentTab': tabs[0], 'start': new Date().getTime()});
        });
    },
    
    async stopTimer() {
        chrome.storage.local.get(['start', 'currentTab', 'secondsCounter', 'websiteInfo']).then(async (result) => {
            const tab = result.currentTab;
            const start = result.start;
            const urlParts = new URL(tab.url);
            const url = tab.url.split('//')[0] + '//' + urlParts.hostname;
            const timeSpent = Math.floor((new Date().getTime() - start) / 1000);
            if (url in result.websiteInfo) {
                result.websiteInfo[url].time += timeSpent;
            } else {
                result.websiteInfo[url] = {time: timeSpent, favIconUrl: tab.favIconUrl};
            }
            result.secondsCounter += timeSpent;
            await chrome.storage.local.set({'websiteInfo': result.websiteInfo, 'secondsCounter': result.secondsCounter, 'start': new Date().getTime()});
        });
    }
};
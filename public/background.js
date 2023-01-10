/*global chrome*/

import utils from './js/utils.js';

function getDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}

chrome.storage.local.get(['date']).then((result) => {
    if (result.date != getDate()) {
        chrome.storage.local.set({'secondsCounter': 0, 'websiteInfo': {}, 'date': getDate()});
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'startTimer') {
        utils.startTimer();
    } else if (request.action === 'stopTimer') {
        utils.stopTimer();
    }
    return true;
});
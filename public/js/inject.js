chrome.runtime.sendMessage({action: 'startTimer'});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        chrome.runtime.sendMessage({action: 'startTimer'});
    } else {
        chrome.runtime.sendMessage({action: 'stopTimer'});
    }
});
chrome.runtime.sendMessage({action: 'startTimer'});
let timeout = setTimeout(update, 30000);

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        chrome.runtime.sendMessage({action: 'startTimer'});
        timeout = setTimeout(update, 30000);
    } else {
        chrome.runtime.sendMessage({action: 'stopTimer'});
        clearTimeout(timeout);
    }
});

function update() {
    chrome.runtime.sendMessage({action: 'stopTimer'});
    timeout = setTimeout(update, 30000);
}
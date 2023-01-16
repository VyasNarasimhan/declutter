/* global chrome */

import React from "react";

function Tracker() {
    const [websites, setWebsites] = React.useState([]);
    const [secondsCounter, setSecondsCounter] = React.useState(0);
    const [hasUpdated, setHasUpdated] = React.useState(false);

    function getTime(time) {
        if (time < 60) {
            return Math.floor(time) + 'sec';
        } else if (time < 3600) {
            return Math.floor(time / 60) + 'min';
        } else if (time % 3600 === 0 || time % 3600 < 60) {
            return Math.floor(time / 3600) + 'hr';
        } else {
            return Math.floor(time / 3600) + 'hr' + Math.floor((time % 3600) / 60) + 'min';
        }
    }

    function Website({ data }) {
        return (
            <div className="grid grid-rows-2">
                <div className="flex justify-between mb-1">
                    <div className="flex">
                        <img className="h-6 w-6 mr-2 fill-current" src={data.favIconUrl} />
                        <span className="text-base font-medium align-text-bottom">{data.name}</span>
                    </div>
                    <span className="text-base text-slate-600 font-medium align-text-bottom">{getTime(data.time)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: ((data.time / secondsCounter) * 100) + '%'}}></div>
                </div>
            </div>
        );
    }

    if (!hasUpdated) {
        chrome.storage.local.get(['start', 'currentTab', 'secondsCounter', 'websiteInfo']).then(async (result) => {
            chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
                if (result.start && tabs[0].url.indexOf('http') === 0) {
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
                    chrome.storage.local.set({'websiteInfo': result.websiteInfo, 'secondsCounter': result.secondsCounter, start: new Date().getTime()});
                }
                let newArray = [];
                Object.entries(result.websiteInfo).forEach((website) => {
                    const [key, value] = website;
                    newArray.push({name: key, time: value.time, favIconUrl: value.favIconUrl});
                });
                newArray.sort(function (a, b) {
                    return b.time - a.time;
                });
                setHasUpdated(true);
                setWebsites(newArray);
                setSecondsCounter(result.secondsCounter); 
            });
        });
    }

    if (websites.length === 0) {
        return (
            <div class="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md" role="alert">
                <p class="font-bold">No activity has been tracked yet.</p>
                <p class="text-sm">Check back later. Your browser usage will be reported here.</p>
            </div>
        );
    } else {
        return (
            <div className="grid grid-cols-1">
                <span class="text-2xl mb-3 font-semibold">{getTime(secondsCounter)}</span>
                {websites.map((websiteInfo) => <Website data={websiteInfo} />)}
            </div>
        );
    }
};

export default Tracker;
/* global chrome */

import React from "react";

function Focus() {

    let display = null;

    const [websites, setWebsites] = React.useState([]);
    const [newWebsite, setNewWebsite] = React.useState('');
    const [loaded, setLoaded] = React.useState('');
    const [selectAll, setSelectAll] = React.useState(true);
    const [group, setGroup] = React.useState(null);
    const [websiteInfo, setWebsiteInfo] = React.useState(null);

    function getTime(name) {
        let time = 0;
        Object.entries(websiteInfo).forEach((website) => {
            const [key, value] = website;
            if (key.indexOf(name) !== -1 || name.indexOf(key) !== -1) {
                time = value.time;
            }
        });
        if (time !== 0) {
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
        return null;
    }

    const groupTabs = () => {
        chrome.tabs.query({}, function(tabs) { 
            let tabIds = [];
            for (let website of websites.filter(website => website.checked)) {
                for (let tab of tabs) {
                    if (tab.url.indexOf(website.name) != -1) {
                        tabIds.push(tab.id);
                    }
                }
            }
            chrome.tabs.group({tabIds}).then((groupId) => {
                chrome.tabGroups.update(groupId, {title: "Focus", collapsed: true}, function() {
                    setGroup(groupId);
                });
            });
        });
    };

    const ungroupTabs = () => {
        chrome.tabs.query({ groupId: group}, function(tabs) {
            chrome.tabs.ungroup(tabs.map(tab => tab.id), function() {
                setGroup(null);
            });
        }); 
    };

    const updateAddWebsite = event => {
        setNewWebsite(event.target.value);
    };

    const updateChecked = event => {
        setWebsites(websites.map(website => {
            if (website.name === event.target.value) {
                return { name: website.name, checked: !website.checked };
            } else {
                return website;
            }
        }));
    };

    const removeWebsite = event => {
        setWebsites(
            websites.filter(website =>
                website.name !== event.currentTarget.value
            )
        );
    };

    const addWebsite = () => {
        setWebsites([
            { name: newWebsite, checked: true },
            ...websites
        ]);
        setNewWebsite('');
    };

    const updateSelectAll = () => {
        setSelectAll(!selectAll);
        setWebsites(websites.map(website => {
            website.checked = !selectAll;
            return website;
        }));
    };

    const deleteSelected = () => {
        setWebsites(
            websites.filter(website =>
                !website.checked
            )
        );
    };

    function Website({ data }) {
        return (
            <div className="flex justify-between mb-1 p-1">
                <div class="flex items-center">
                    <input type="checkbox" value={data.name} class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 mr-2" checked={data.checked} onClick={updateChecked}/>
                    <label class="ml-1 text-base font-medium">{data.name}</label>
                    <span className="ml-1 text-base text-slate-600 font-medium align-text-bottom">{getTime(data.name) ? getTime(data.name) : ''}</span>
                </div>
                <button type="button" value={data.name} class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg p-2" onClick={removeWebsite}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" value={data.name}>
                        <path value={data.name} strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        );
    }

    if (!loaded) {
        chrome.storage.local.get(['websites', 'websiteInfo']).then((result) => {
            if (result.websites) {
                setWebsites(result.websites.map(website => ({name: website, checked: true})));
            }
            setWebsiteInfo(result.websiteInfo);
        });
        setLoaded(true);
    } else {
        chrome.storage.local.set({'websites': websites.map((website) => website.name)});
    }

    if (websites.length === 0) {
        display = (
            <div class="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 shadow-md" role="alert">
                <p class="font-bold">No websites have been added yet.</p>
                <p class="text-sm">As you add websites, they will be displayed here.</p>
            </div>
        );
    } else {
        display = (
            <div className="w-full">
                {websites.map((website) => <Website data={website} />)}
                {/* <hr class="h-px bg-gray-200 border-0" /> */}
            </div>
        );
    }

    let groupButton = <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-3 py-2 mr-1 focus:outline-none" onClick={groupTabs}>
        <p className="text-base">Group selected</p>
    </button>
    let ungroupButton = <button type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-3 py-2 text-center mr-1" onClick={ungroupTabs}>
        <p className="text-base">Ungroup</p>
    </button>

    chrome.tabGroups.query({ title: 'Focus'}, function(groups) {
        setGroup(groups.length > 0 ? groups[0].id : null);
    });

    return (
        <div className="grid grid-cols-1">
            <form className="w-full mb-2">
                <div className="flex items-center border-b border-blue-600 py-1">
                    <input className="appearance-none text-base bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="youtube.com" onChange={updateAddWebsite} value={newWebsite} />
                    <button className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded" type="button" onClick={addWebsite}>
                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-base">Add</p>
                        </div>
                    </button>
                </div>
            </form>
            <div className="flex justify-between mb-2 p-1">
                <div class="flex items-center">
                    <input type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 mr-2" checked={selectAll} onClick={updateSelectAll}/>
                    <label class="ml-1 text-base font-medium">Select All</label>
                </div>
                <div class="flex items-center">
                    {group ? ungroupButton : groupButton}
                    <button type="button" className="flex-shrink-0 bg-red-700 hover:bg-red-800 border-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 text-sm rounded-lg text-white py-2 px-2" onClick={deleteSelected}>
                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            <p className="text-base">Delete Selected</p>
                        </div>
                    </button>
                </div>
            </div>
            {display}
        </div>
    );
};

export default Focus;
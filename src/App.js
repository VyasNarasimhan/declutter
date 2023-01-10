/*global chrome*/

import React from "react";
import Tracker from './Tracker.js';
import Focus from './Focus.js'

function App() {

    const [selected, setSelected] = React.useState('tracker');

    const activeClass = "w-full inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active";
    const unactiveClass = "w-full inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white";

    const changeTab = () => {
        if (selected === 'tracker') {
            setSelected('focus');
        } else {
            setSelected('tracker');
        }
    }

    return (
        <div class="container m-auto p-3">
            <ul class="grid grid-cols-2 gap-2 flex flex-wrap text-sm font-medium text-center text-gray-500 mb-1">
                <li class="w-full">
                    <a href="#" class={selected === 'tracker' ? activeClass : unactiveClass} onClick={selected === 'focus' ? changeTab : undefined}>Tracker</a>
                </li>
                <li class="w-full">
                    <a href="#" class={selected === 'focus' ? activeClass : unactiveClass} onClick={selected === 'tracker' ? changeTab : undefined}>Focus</a>
                </li>
            </ul>
            {selected === 'tracker' ? <Tracker /> : <Focus />}
        </div>
    );
}

export default App;

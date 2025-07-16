import React, { useState } from 'react';
import axios from 'axios';
import './TopBar.modules.css'

function TopBar({ onSaveButtonClick, onNewNote, onLogout }) {
    const [saveButtonText, setSaveButtonText] = useState("Save");
    const [showMenu, setShowMenu] = useState(false);

    function handleSaveClick() {
        onSaveButtonClick();
        setSaveButtonText("✔");

        setTimeout(() => {
            setSaveButtonText("Save");
        }, 1000);
    }

    return (
    <div className="topbar">
        <ul>
            <li>
                <button id='file' onClick={() => setShowMenu(!showMenu)}>File</button>
                {showMenu && (
                    <div className='menu'>
                        <button onClick={() => {setShowMenu(false); onNewNote();}}>New Note</button>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                )}
            </li>
            <li>
                <button
                    id='save'
                    onClick={() => handleSaveClick()}>{saveButtonText}</button>
            </li>
        </ul>
    </div>);
}

export default TopBar;
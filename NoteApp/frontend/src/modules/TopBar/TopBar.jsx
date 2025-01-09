import React, { useState } from 'react';
import axios from 'axios';
import './TopBar.modules.css'

function TopBar({ onSaveButtonClick }) {
    const [saveButtonText, setSaveButtonText] = useState("Save");

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
                <button id='file'>File</button>
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
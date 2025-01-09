import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sidebar.modules.css';

function Sidebar({ onSidebarNoteClick }) {
    const [notes, setNotes] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/get-notes")
            .then(response => {
                setNotes(response.data.notes);
            })
            .catch(err => {
                setError("Loading notes failed!");
                console.error(err);
            });
    }, []);

    const handleClick = (noteId) => {
        onSidebarNoteClick(noteId);
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!notes || notes.length === 0) {
        return <div>Lädt...</div>;
    }

    return (
        <div className="sidebar">
            <ul>
                {notes.map((note) => (
                    <li
                        key={note.id}
                        onMouseDown={() => handleClick(note.id)}>
                        {note.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;

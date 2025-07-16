import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sidebar.modules.css';

function Sidebar({ onSidebarNoteClick, refreshSignal }) {
    const [notes, setNotes] = useState(null);
    const [error, setError] = useState(null);

    const fetchNotes = () => {
        axios.get("http://localhost:8000/get-notes")
            .then(response => {
                setNotes(response.data.notes);
            })
            .catch(err => {
                setError("Loading notes failed!");
                console.error(err);
            });
    };

    useEffect(() => {
        fetchNotes();
    }, [refreshSignal]);

    const handleClick = (noteId) => {
        onSidebarNoteClick(noteId);
    }

    const handleDelete = (noteId) => {
        axios.delete(`http://localhost:8000/delete-note/${noteId}`)
            .then(() => {
                fetchNotes();
            });
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
                    <li key={note.id}>
                        <span onMouseDown={() => handleClick(note.id)}>{note.name}</span>
                        <button className='delete' onClick={() => handleDelete(note.id)}>🗑</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;

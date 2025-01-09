import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Note.modules.css'

function Note(props) {
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [newContent, setNewContent] = useState("");
  const textareaRef = useRef(null);

  const handleContentChange = (e) => {
    setNewContent(e.target.value);
    autoResizeTextarea(e.target);
  }

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
    
    if (props.currentNoteId) {
      axios
        .get(`http://localhost:8000/note/${props.currentNoteId}`)
        .then(response => {
          setNote(response.data.note);
          setNewContent(response.data.note.text);
          setError(null);
        })
        .catch(err => {
          setError("Fehler beim Abrufen der Notiz");
          console.error(err);
        });
    }
  }, [props.currentNoteId]);

  useEffect(() => {
    if (props.saveSignal) {
      axios.put(`http://localhost:8000/update-note-content/${props.currentNoteId}`, {
        newContent: newContent.trim(),
      })
      .then(response => {
        alert("Note saved successfully!")
      })
      .catch(error => {
        alert("An error accured: ", error);
      });
    }
  }, [props.saveSignal]);

  if (error) {
    return <div className='info'>{error}</div>;
  }

  if (!note) {
    return <div className='info'>Open up a note</div>;
  }

  return (
    <div className='note'>
      <h2>Notiz {note.id}</h2>
      <p><strong>Name:</strong> {note.name}</p>
      <textarea
        id='text-input'
        placeholder='Enter your note here...'
        onChange={handleContentChange}
        value={newContent}
      />
    </div>
  );
}

export default Note;

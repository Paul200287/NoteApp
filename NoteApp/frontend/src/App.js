import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Note from './modules/Note/Note.jsx'
import TopBar from './modules/TopBar/TopBar.jsx';
import Sidebar from './modules/Sidebar/Sidebar.jsx';
import Login from './modules/Auth/Login.jsx';
import axios from 'axios';

function App() {
  const [currentNoteId, setCurrentNoteId] = useState(0);
  const [saveSignal, setSaveSignal] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLogged(true);
    }
  }, []);

  const handleSidebarNoteClick = (newNoteId) => {
    setCurrentNoteId(newNoteId);
  }

  const handleSaveButtonClick = () => {
    setSaveSignal((prev) => !prev);
    setTimeout(() => setSaveSignal((prev) => !prev),200);
  }

  const handleNewNote = () => {
    const name = prompt('Name der Note');
    if (name) {
      axios.post('http://localhost:8000/create-note', { name, text: '' })
        .then(() => setRefreshSignal(prev => !prev));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setLogged(false);
  };

  if (!logged) {
    return <Login onLogin={() => setLogged(true)} />;
  }

  return (
    <div className='App'>
      <TopBar onSaveButtonClick={handleSaveButtonClick} onNewNote={handleNewNote} onLogout={handleLogout}></TopBar>
      <div className='content'>
        <Sidebar onSidebarNoteClick={handleSidebarNoteClick} refreshSignal={refreshSignal}></Sidebar>
        <Note currentNoteId={currentNoteId} saveSignal={saveSignal}></Note>
      </div>
    </div>
  );
}

export default App;

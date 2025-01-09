import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Note from './modules/Note/Note.jsx'
import TopBar from './modules/TopBar/TopBar.jsx';
import Sidebar from './modules/Sidebar/Sidebar.jsx';

function App() {
  const [currentNoteId, setCurrentNoteId] = useState(0);
  const [saveSignal, setSaveSignal] = useState(false);

  const handleSidebarNoteClick = (newNoteId) => {
    setCurrentNoteId(newNoteId);
  }

  const handleSaveButtonClick = () => {
    setSaveSignal((prev) => !prev);
    setTimeout(() => setSaveSignal((prev) => !prev),200);
  }

  return (
    <div className='App'>
      <TopBar onSaveButtonClick={() => handleSaveButtonClick()}></TopBar>
      <div className='content'>
        <Sidebar onSidebarNoteClick={handleSidebarNoteClick}></Sidebar>
        <Note currentNoteId={currentNoteId} saveSignal={saveSignal}></Note>
      </div>
    </div>
  );
}

export default App;

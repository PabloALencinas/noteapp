"use client";

import React, { useState } from 'react';
import NotesList from './NotesList';
import CreateNoteModal from './CreateNoteModal';

export default function Home() {
  const [notes] = useState([]);
  const [filter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNoteClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };


  return (
    <main className="flex flex-col items-center justify-between" style={{ padding: "4rem"}}>
      
      <h1 className="text-4xl font-bold mb-8">Welcome to <span className="gradient-text">NoteApp!</span></h1>

      <h2 className="text-l font-bold mb-8">Simple application to take notes and more</h2>

      <button onClick={handleCreateNoteClick} className="create-note-button mb-12 mt-2 text-white px-6 py-3 text-lg text-4xl font-bold mb-8">
        Create Note
      </button>
    
      <NotesList notes={notes} filter={filter} />

      <CreateNoteModal isOpen={isOpen} onClose={handleClose} />
    </main>
  );
}
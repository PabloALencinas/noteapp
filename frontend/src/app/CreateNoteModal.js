"use client";

import React, { useState, useEffect } from 'react';
import './CreateNoteModal.css';
import Modal from 'react-modal'; 
import axios from 'axios';


function CreateNoteModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/v1/notes/create-note', {
        title,
        content,
        tag,
      });

      if (response.status === 201 || response.status === 200) { 
        window.dispatchEvent(new CustomEvent('noteCreated'));
        onClose();
      } else {
        console.error('Error creating note:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={{ overlay: { backgroundColor: 'none' } }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title gradient-text">Create Note</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="modal-field">
              <label htmlFor="title" className="modal-label font-bold">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="modal-input"
                style={{ backgroundColor: 'black', border: '1px solid white', padding: '10px', fontSize: '1.5rem' }}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="content" className="modal-label font-bold">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="modal-input"
                style={{ backgroundColor: 'black', border: '1px solid white', padding: '10px', fontSize: '1.5rem', paddingBottom: '10%' }}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="tag" className="modal-label font-bold">Tag</label>
              <input
                id="tag"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                required
                className="modal-input"
                style={{ backgroundColor: 'black', border: '1px solid white', padding: '10px', fontSize: '1.5rem' }}
              />
            </div>
            <button type="submit" className="create-note-button mb-12 mt-2 text-white px-6 py-3 text-lg text-4xl font-bold mb-8">Create</button>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default CreateNoteModal;

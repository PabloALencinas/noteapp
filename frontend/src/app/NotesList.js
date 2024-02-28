"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './globals.css';

export default function NotesList() {
    
    const [notes, setNotes] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [tag, setTag] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagInputValue, setTagInputValue] = useState('');

    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/notes/all');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };  

    useEffect(() => {
      fetchNotes();
    }, []); 

    const fetchNotesByTag = async (tag) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/notes/tags/${tag}`);
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes by tag:', error);
      }
    };
  
    const handleSearch = async () => {
      try {
        await fetchNotesByTag(searchTerm);
      } catch (error) {
        console.error('Error fetching notes by tag:', error);
      }
    };


    const fetchFilterNotes = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/notes/${filter}`);
        console.log('Filtered Notes:', response.data); // Log the fetched notes for debugging
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
  
    useEffect(() => {
      fetchFilterNotes(); // Fetch notes when the component mounts
    }, [filter]); // Re-fetch notes when the filter changes

    const handleFilterChange = (newFilter) => {
      setFilter(newFilter);
      fetchNotes(newFilter); // Fetch notes based on the selected filter
    };

    const handleEditNote = async (noteId) => {
      // Set edit mode to the ID of the note being edited
      setEditMode(noteId);
    };

    useEffect(() => {
      const handleNoteCreated = () => {
        fetchNotes(); // Refresh notes after the event
      };
    
      window.addEventListener('noteCreated', handleNoteCreated);
    
      return () => {
        window.removeEventListener('noteCreated', handleNoteCreated);
      };
    }, []);

    const toggleTagInput = (noteId) => {
      setTagInputStates((prevState) => ({
        ...prevState,
        [noteId]: !prevState[noteId]
      }));
    };

    const handleDeleteTag = async (noteId) => {
      try {
        const response = await axios.put(`http://localhost:8080/api/v1/notes/delete-tag/${noteId}`);
    
        if (response.status === 200 || response.status === 201) {
          console.log("Note tag deleted successfully");
          fetchNotes();
          setShowTagInput(false);
        } else {
          console.error('Error while trying to delete tag:', response.statusText);
        }
      } catch (error) {
        console.error("Error while trying to delete tag:", error.message);
      }
    }

    const handleAddTag = async (noteId, tagRequest) => {
      try {
        const response = await axios.put(`http://localhost:8080/api/v1/notes/add-tag/${noteId}`, {
          tag: tagRequest
        });
    
        if (response.status === 200 || response.status === 201) {
          console.log("Note tag added successfully");
          fetchNotes();
          toggleTagInput();
        } else {
          console.error('Error while trying to add a tag:', response.statusText);
        }
      } catch (error) {
        console.error("Error while trying to add a tag:", error.message);
      }
    };

    const handleSaveEdit = async (noteId, newTitle, newContent) => {
      try {
        const response = await axios.put(`http://localhost:8080/api/v1/notes/edit-note/${noteId}`, {
          title: newTitle,
          content: newContent,
        });
    
        if (response.status === 200 || response.status === 201) {
          // Handle successful edit
          console.log('Note edited successfully');
          setEditMode(null); // Exit edit mode
          fetchNotes();
        } else {
          // Handle error
          console.error('Error editing note:', response.data);
        }
      } catch (error) {
        console.error('Error editing note:', error);
      }
    };
    
    const handleDeleteNote = async (noteId) => {
      try {
        // confirmation before deleting
        const confirmDelete = window.confirm('Are you sure you want to delete this note?');
        if (!confirmDelete) return; 

        const response = await axios.delete(`http://localhost:8080/api/v1/notes/delete-note/${noteId}`);
    
        if (response.status === 200) {
          console.log('Note deleted successfully');
          fetchNotes();
        } else {
          // Handle error
          console.error('Error deleting note:', response.data);
          fetchNotes();
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    };

    const handleToggleArchiveNote = async (noteId) => {
      try {
        // Fetch the note to get its current status
        const noteToUpdate = notes.find(note => note.id === noteId);
        if (!noteToUpdate) {
          console.error('Note not found');
          return;
        }
        
        // Determine the new status based on the current status
        const newStatus = noteToUpdate.status === 'UNARCHIVED' ? 'ARCHIVED' : 'UNARCHIVED';
        
        // Update the note's status locally
        const updatedNotes = notes.map(note => {
          if (note.id === noteId) {
            return { ...note, status: newStatus };
          }
          return note;
        });
        setNotes(updatedNotes);
        
        // Send the updated status to the server
        const response = await axios.put(`http://localhost:8080/api/v1/notes/change-status/${noteId}`,   {
          noteStatus: newStatus // Use noteStatus property as expected by the API
        });
        
        if (response.status === 200) {
          console.log('Note status toggled successfully');
          setNotes((prevNotes) =>
            prevNotes.map((note) => (note.id === noteId ? { ...note, status: newStatus } : note))
          );
          fetchNotes();
        } else {
          console.error('Error toggling archive status:', response.data);
          // Revert the local update if there's an error
          setNotes(notes);
          fetchNotes();
        }
      } catch (error) {
        console.error('Error toggling archive status:', error);
        // Revert the local update if there's an error
        setNotes(notes);
      }
    };


    return (

      <div className="notes-container">

        <div className='filter-container'>

          <button className={`filter-button ${filter === 'all' ? 'active' : ''} 
              all-notes-button mb-12 mt-2 text-white px-6 py-3 text-lg text-4xl font-bold mb-8 mr-5`}
              onClick={() => handleFilterChange('all')}>
                All Notes
          </button>

          <button className={`filter-button ${filter === 'archived' ? 'active' : ''} 
              archived-notes-button mb-12 mt-2 text-white px-6 py-3 text-lg text-4xl font-bold mb-8 mr-5`} 
              onClick={() => handleFilterChange('archived')}>
              Archived
          </button>

          <button className={`filter-button ${filter === 'unarchived' ? 'active' : ''} 
              unarchived-notes-button mb-12 mt-2 text-white px-6 py-3 text-lg text-4xl font-bold mb-8`} 
              onClick={() => handleFilterChange('unarchived')}>
                Unarchived
          </button>


        </div>
        

        <div className="search-container">
          <input
            type="text"
            placeholder="Filter by tag"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modal-input"
          />
          <button onClick={handleSearch} className="search-button">
            Filter
          </button>
        </div>
      
        <div className="notes-grid mt-10">

        {filter === 'all' ? (
          // Render all notes
          notes.map((note) => ( 
          <div
          key={note.id}
          note={note}
          className="mb-4 p-4 border card-style"
          style={{ position: 'relative' }} >

            {editMode === note.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90%', marginBottom: '10px' }}>
                {/* Controlled inputs with state-based values */}
                <input
                  style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px' }}
                  value={note.title}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    const index = newNotes.findIndex((n) => n.id === note.id);
                    if (index !== -1) {
                      newNotes[index].title = e.target.value;
                      setNotes(newNotes);
                    }
                  }}
                />
                <textarea
                  style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px' }}
                  value={note.content}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    const index = newNotes.findIndex((n) => n.id === note.id);
                    if (index !== -1) {
                      newNotes[index].content = e.target.value;
                      setNotes(newNotes);
                    }
                  }}
                />
                <button onClick={() => handleSaveEdit(note.id, note.title, note.content)}
                className="save-button text-white text-lg text-s">Save</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <h2 className="text-lg font-bold mb-4 mt-2 title">{note.title}
                <span style={{ margin: '0.1rem 0.5rem' }}></span>
                {note.tag && (
                  <div className="tag font-bold">{note.tag}</div>
                )}
                </h2>
                <hr />
                <p className="text-sm mt-4 content-style">{note.content}</p>
                <div className='note-style'>
                  <button onClick={() => handleEditNote(note.id)} className="edit-button text-white text-lg text-s">
                    Edit
                  </button>
                  <span style={{ margin: '0 0.5rem' }}></span>
                  <button onClick={() => handleDeleteNote(note.id)} className="delete-button text-white text-lg text-s">
                    Delete
                  </button>
                  <span style={{ margin: '0 0.5rem' }}></span>
                  {note.tag ? (
                    <button onClick={() => handleDeleteTag(note.id)} className="delete-tag-button text-white text-lg text-s">
                      Untagged
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center'}}>
                      <button onClick={() => setShowTagInput(true)} className="add-tag-button text-white text-lg text-s">
                        Tag
                      </button>
                      {showTagInput && (
                        <div>
                          <input
                            type="text"
                            value={tagInputValue}
                            onChange={(e) => setTagInputValue(e.target.value)}
                            placeholder="Enter tag"
                            className='modal-input'
                            style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px', width: '105px' }}
                          />
                          <button onClick={() => handleAddTag(note.id, tagInputValue)} className="submit-tag-button text-white text-lg text-s">
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <span style={{ margin: '0 0.5rem' }}></span>
                  <button onClick={() => handleToggleArchiveNote(note.id)} className="expand-button text-white px-6 py-3 text-lg text-lg text-s">
                    {note.status === 'UNARCHIVED' ? 'Archive' : 'Unarchive'}
                  </button>
                </div>
              </div>
            )}
          </div>
          ))
        ) : filter === 'archived' ? (
          // Render only archived notes
          notes
          .filter((note) => note.status === 'ARCHIVED')
          .map((note) => (
            <div
            key={note.id}
            note={note}
            className="mb-4 p-4 border card-style"
            style={{ position: 'relative' }}
          >

            {editMode === note.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90%', marginBottom: '10px' }}>
                {/* Controlled inputs with state-based values */}
                <input
                  style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px' }}
                  value={note.title}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    const index = newNotes.findIndex((n) => n.id === note.id);
                    if (index !== -1) {
                      newNotes[index].title = e.target.value;
                      setNotes(newNotes);
                    }
                  }}
                />
                <textarea
                  style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px' }}
                  value={note.content}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    const index = newNotes.findIndex((n) => n.id === note.id);
                    if (index !== -1) {
                      newNotes[index].content = e.target.value;
                      setNotes(newNotes);
                    }
                  }}
                />
                <button onClick={() => handleSaveEdit(note.id, note.title, note.content)}
                className="save-button text-white text-lg text-s">Save</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <h2 className="text-lg font-bold mb-4 mt-2 title">{note.title}
                <span style={{ margin: '0.1rem 0.5rem' }}></span>
                {note.tag && (
                  <div className="tag font-bold">{note.tag}</div>
                )}
                </h2>
                <hr />
                <p className="text-sm mt-4 content-style">{note.content}</p>
                <div className='note-style'>
                  <button onClick={() => handleEditNote(note.id)} className="edit-button text-white text-lg text-s">
                    Edit
                  </button>
                  <span style={{ margin: '0 0.5rem' }}></span>
                  <button onClick={() => handleDeleteNote(note.id)} className="delete-button text-white text-lg text-s">
                    Delete
                  </button>
                  <span style={{ margin: '0 0.5rem' }}></span>
                  {note.tag ? (
                    <button onClick={() => handleDeleteTag(note.id)} className="delete-tag-button text-white text-lg text-s">
                      Untagged
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center'}}>
                      <button onClick={() => setShowTagInput(true)} className="add-tag-button text-white text-lg text-s">
                        Tag
                      </button>
                      {showTagInput && (
                        <div>
                          <input
                            type="text"
                            value={tagInputValue}
                            onChange={(e) => setTagInputValue(e.target.value)}
                            placeholder="Enter tag"
                            className='modal-input'
                            style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px', width: '105px' }}
                          />
                          <button onClick={() => handleAddTag(note.id, tagInputValue)} className="submit-tag-button text-white text-lg text-s">
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <span style={{ margin: '0 0.5rem' }}></span>
                  <button onClick={() => handleToggleArchiveNote(note.id)} className="expand-button text-white px-6 py-3 text-lg text-lg text-s">
                    {note.status === 'UNARCHIVED' ? 'Archive' : 'Unarchive'}
                  </button>
                </div>
              </div>
            )}
          </div>
          ))
        ) : (
          // Render only unarchived notes
          notes.filter((note) => note.status === 'UNARCHIVED').map((note) => (
            <div
            key={note.id}
            note={note}
            className="mb-4 p-4 border card-style"
            style={{ position: 'relative' }}
          >

            {editMode === note.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90%', marginBottom: '10px' }}>
                {/* Controlled inputs with state-based values */}
                <input
                  style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px' }}
                  value={note.title}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    const index = newNotes.findIndex((n) => n.id === note.id);
                    if (index !== -1) {
                      newNotes[index].title = e.target.value;
                      setNotes(newNotes);
                    }
                  }}
                />
                <textarea
                  style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px' }}
                  value={note.content}
                  onChange={(e) => {
                    const newNotes = [...notes];
                    const index = newNotes.findIndex((n) => n.id === note.id);
                    if (index !== -1) {
                      newNotes[index].content = e.target.value;
                      setNotes(newNotes);
                    }
                  }}
                />
                <button onClick={() => handleSaveEdit(note.id, note.title, note.content)}
                className="save-button text-white text-lg text-s">Save</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <h2 className="text-lg font-bold mb-4 mt-2 title">{note.title}
                <span style={{ margin: '0.1rem 0.5rem' }}></span>
                {note.tag && (
                  <div className="tag font-bold">{note.tag}</div>
                )}
                </h2>
                <hr />
                <p className="text-sm mt-4 content-style">{note.content}</p>
                <div className='note-style'>
                  <button onClick={() => handleEditNote(note.id)} className="edit-button text-white text-lg text-s">
                    Edit
                  </button>
                  <span style={{ margin: '0 0.5rem' }}></span>
                  <button onClick={() => handleDeleteNote(note.id)} className="delete-button text-white text-lg text-s">
                    Delete
                  </button>
                  <span style={{ margin: '0 0.5rem' }}></span>
                  {note.tag ? (
                    <button onClick={() => handleDeleteTag(note.id)} className="delete-tag-button text-white text-lg text-s">
                      Untagged
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center'}}>
                      <button onClick={() => setShowTagInput(true)} className="add-tag-button text-white text-lg text-s">
                        Tag
                      </button>
                      {showTagInput && (
                        <div>
                          <input
                            type="text"
                            value={tagInputValue}
                            onChange={(e) => setTagInputValue(e.target.value)}
                            placeholder="Enter tag"
                            className='modal-input'
                            style={{ backgroundColor: 'black', border: '1px solid white', padding: '5px', width: '105px' }}
                          />
                          <button onClick={() => handleAddTag(note.id, tagInputValue)} className="submit-tag-button text-white text-lg text-s">
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <span style={{ margin: '0 0.5rem' }}></span>
                  <button onClick={() => handleToggleArchiveNote(note.id)} className="expand-button text-white px-6 py-3 text-lg text-lg text-s">
                    {note.status === 'UNARCHIVED' ? 'Archive' : 'Unarchive'}
                  </button>
                </div>
              </div>
            )}
          </div>
          ))
        )}

        </div>



      </div>

      


    );
    

    


}
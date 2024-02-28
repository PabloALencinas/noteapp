package com.pabloagustin.backend.services;

import com.pabloagustin.backend.models.Note;
import com.pabloagustin.backend.models.NoteStatus;
import com.pabloagustin.backend.payload.NoteRequest;
import com.pabloagustin.backend.payload.StatusRequest;
import com.pabloagustin.backend.payload.TagRequest;
import com.pabloagustin.backend.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoteService {

	private final NoteRepository noteRepository;

	public List<Note> allNotes(){
		return noteRepository.findAll();
	}

	public List<Note> getArchivedNotes(){
		return noteRepository.findByStatus(NoteStatus.ARCHIVED);
	}

	public List<Note> getUnarchivedNotes(){
		return noteRepository.findByStatus(NoteStatus.UNARCHIVED);
	}

	public List<Note> getNotesByTag(String tag) {
		return noteRepository.findByTagContainingIgnoreCase(tag);
	}

	public void createNote(NoteRequest noteRequest){

		Note newNote = new Note();
		newNote.setTitle(noteRequest.title());
		newNote.setContent(noteRequest.content());
		newNote.setStatus(NoteStatus.UNARCHIVED);
		newNote.setTag(noteRequest.tag());

		noteRepository.save(newNote);

	}

	public void editNote(Long noteId, NoteRequest noteRequest){
		Optional<Note> note = noteRepository.findById(noteId);

		if (note.isPresent()){
			Note currentNote = note.get();
			currentNote.setTitle(noteRequest.title());
			currentNote.setContent(noteRequest.content());

			noteRepository.save(currentNote);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
		}
	}


	public void deleteNote(Long noteId){
		Optional<Note> note = noteRepository.findById(noteId);

		if (note.isPresent()) {
			noteRepository.deleteById(noteId);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
		}
	}

	public void changeNoteStatus(Long noteId, StatusRequest statusRequest){

		Optional<Note> note = noteRepository.findById(noteId);

		if (note.isPresent()) {
			Note currentNote = note.get();
			currentNote.setTitle(currentNote.getTitle());
			currentNote.setContent(currentNote.getContent());
			if (statusRequest.noteStatus() != null) {
				currentNote.setStatus(statusRequest.noteStatus());
			}
			noteRepository.save(currentNote);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
		}

	}

	public void deleteNoteTag(Long noteId){

		Optional<Note> note = noteRepository.findById(noteId);

		if (note.isPresent()) {
			Note currentNote = note.get();
			// Avoid null fields for other attributes
			currentNote.setTitle(currentNote.getTitle());
			currentNote.setContent(currentNote.getContent());
			currentNote.setStatus(currentNote.getStatus());
			currentNote.setTag("");
			noteRepository.save(currentNote);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
		}

	}


	public void addNoteTag(Long noteId, TagRequest tagRequest){

		Optional<Note> note = noteRepository.findById(noteId);

		if (note.isPresent()) {
			Note currentNote = note.get();
			// Avoid null fields for other attributes
			currentNote.setTitle(currentNote.getTitle());
			currentNote.setContent(currentNote.getContent());
			currentNote.setStatus(currentNote.getStatus());
			currentNote.setTag(tagRequest.tag());
			noteRepository.save(currentNote);
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found");
		}

	}



}

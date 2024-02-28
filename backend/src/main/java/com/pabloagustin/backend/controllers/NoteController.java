package com.pabloagustin.backend.controllers;

import com.pabloagustin.backend.models.Note;
import com.pabloagustin.backend.payload.NoteRequest;
import com.pabloagustin.backend.payload.TagRequest;
import com.pabloagustin.backend.payload.StatusRequest;
import com.pabloagustin.backend.services.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NoteController {

	private final NoteService notesService;

	@GetMapping("/all")
	public List<Note> getAllNotes(){
		return notesService.allNotes();
	}

	@GetMapping("/archived")
	public List<Note> getArchivedNotes(){
		return notesService.getArchivedNotes();
	}

	@GetMapping("/unarchived")
	public List<Note> getUnarchivedNotes(){
		return notesService.getUnarchivedNotes();
	}

	@GetMapping("/tags/{tag}")
	public List<Note> getNotesByTag(@PathVariable String tag) {
		return notesService.getNotesByTag(tag);
	}

	@PostMapping("/create-note")
	public ResponseEntity<?> createNote(@Valid @RequestBody NoteRequest noteRequest){
		notesService.createNote(noteRequest);
		return ResponseEntity.ok().body("Note created successfully");
	}

	@DeleteMapping("/delete-note/{noteId}")
	public ResponseEntity<?> deleteNote(@PathVariable Long noteId){
		notesService.deleteNote(noteId);
		return ResponseEntity.ok().body("Note deleted successfully");
	}

	@PutMapping("/edit-note/{noteId}")
	public ResponseEntity<?> editNote(@PathVariable Long noteId, @Valid @RequestBody NoteRequest noteRequest){
		notesService.editNote(noteId, noteRequest);
		return ResponseEntity.ok().body("Note edited successfully");
	}

	@PutMapping("/change-status/{noteId}")
	public ResponseEntity<?> changeStatus(@PathVariable Long noteId,
	                                      @Valid @RequestBody StatusRequest statusRequest){
		notesService.changeNoteStatus(noteId, statusRequest);
		return ResponseEntity.ok().body("Status changed");
	}

	@PutMapping("/delete-tag/{noteId}")
	public ResponseEntity<?> deleteNoteTag(@PathVariable Long noteId){
		notesService.deleteNoteTag(noteId);
		return ResponseEntity.ok().body("Note tag deleted successfully");
	}

	@PutMapping("/add-tag/{noteId}")
	public ResponseEntity<?> tagNote(@PathVariable Long noteId, @Valid @RequestBody TagRequest tagRequest){
		notesService.addNoteTag(noteId, tagRequest);
		return ResponseEntity.ok().body("Note tag deleted successfully");
	}


}

package com.pabloagustin.backend.repositories;

import com.pabloagustin.backend.models.Note;
import com.pabloagustin.backend.models.NoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
	List<Note> findByStatus(NoteStatus status);
	List<Note> findByTagContainingIgnoreCase(String tag);
}

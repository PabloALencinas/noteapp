package com.pabloagustin.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;


@Entity
@Table(name = "notes")
public class Note {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@NotBlank
	private String title;

	@NotNull
	@NotBlank
	@Column(columnDefinition="TEXT")
	private String content;

	private String tag;
	
	private NoteStatus status;


	public Note(){}

	public Note(String title, String content, NoteStatus status, String tag) {
		this.title = title;
		this.content = content;
		this.status = status;
		this.tag = tag;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public NoteStatus getStatus() {
		return status;
	}

	public void setStatus(NoteStatus status) {
		this.status = status;
	}

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Note note = (Note) o;
		return Objects.equals(id, note.id) && Objects.equals(title, note.title) && Objects.equals(content, note.content) && status == note.status;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, title, content, status);
	}

	@Override
	public String toString() {
		return "Note{" +
				"id=" + id +
				", title='" + title + '\'' +
				", content='" + content + '\'' +
				", status=" + status +
				'}';
	}
}

package com.pabloagustin.backend.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoteRequest(
		@NotBlank @NotNull String title,
		@NotBlank @NotNull String content,
		String tag
){}

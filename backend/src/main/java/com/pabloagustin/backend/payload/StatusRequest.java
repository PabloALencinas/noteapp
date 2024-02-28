package com.pabloagustin.backend.payload;

import com.pabloagustin.backend.models.NoteStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StatusRequest(
		@NotNull @NotBlank NoteStatus noteStatus
		) {
}

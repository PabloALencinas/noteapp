package com.pabloagustin.backend.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TagRequest(
		@NotNull @NotBlank String tag
		) {
}

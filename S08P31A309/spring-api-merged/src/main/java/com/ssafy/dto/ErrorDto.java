package com.ssafy.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ErrorDto {
    private String message;
    public ErrorDto(final String message) {
        this.message = message;
    }

    public ErrorDto of(){
        return new ErrorDto(message);
    }
}

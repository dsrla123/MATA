package com.ssafy.dto;

import com.ssafy.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenDto {
    String token;

    public TokenDto fromEntity(Project project){
        TokenDto response = TokenDto.builder()
                .token(project.getToken())
                .build();
        return response;
    }
}

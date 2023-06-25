package com.ssafy.dto.member.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;

@Getter
@NoArgsConstructor
public class MemberInfoRequest {

    @NotEmpty
    private String accessToken;
    private String refreshToken;
    private Long refreshTokenExpirationTime;

    @Builder
    public MemberInfoRequest(String accessToken, String refreshToken, Long refreshTokenExpirationTime){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.refreshTokenExpirationTime = refreshTokenExpirationTime;
    }
}

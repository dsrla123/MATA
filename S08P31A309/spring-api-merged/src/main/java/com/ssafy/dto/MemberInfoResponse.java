package com.ssafy.dto;

import com.ssafy.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberInfoResponse {
    private Long id;
    private String email;
    private String password;
    private String name;
    private LocalDateTime createAt;
    private boolean isQuit;
    private Set<String> privilege;
    public MemberInfoResponse fromEntity(Member member){
        return MemberInfoResponse.builder()
                .id(member.getId())
                .email(member.getEmail())
                .password(member.getPassword())
                .name(member.getName())
                .createAt(member.getCreateAt())
                .isQuit(member.isQuit())
                .privilege(member.getPrivilege())
                .build();
    }
}

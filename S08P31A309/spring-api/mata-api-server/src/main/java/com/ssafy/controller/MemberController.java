package com.ssafy.controller;

import com.ssafy.dto.member.request.MemberInfoRequest;
import com.ssafy.dto.member.request.MemberLoginRequest;
import com.ssafy.dto.member.request.MemberSignUpRequest;
import com.ssafy.dto.member.response.MemberInfoResponse;
import com.ssafy.dto.member.response.MemberResponse;
import com.ssafy.entity.Member;
import com.ssafy.service.CustomUserDetailsService;
import com.ssafy.service.MemberService;
import com.ssafy.token.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/member")
public class MemberController {
    private final MemberService memberService;
    public static final String AUTHORIZATION_HEADER = "Authorization";
    private final JwtTokenProvider jwtTokenProvider;


    @PostMapping(value="/signup")
    public ResponseEntity<Void> signUp(@Validated @RequestBody MemberSignUpRequest request){
        memberService.signUp(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PostMapping(value = "/login")
    public ResponseEntity<MemberResponse> login(@Validated @RequestBody MemberLoginRequest request){
        MemberResponse response = memberService.login(request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header(response.getAccessToken())
                .body(response);
    }

    // 로그아웃
    @PostMapping(value = "/logout")
    public ResponseEntity<?> logout(HttpServletRequest request){
        String token = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            token =  token.substring(7);
        }

        memberService.logout(token);
        return ResponseEntity.status(HttpStatus.OK).body("Success");
    }

    @GetMapping(value = "/info")
    public ResponseEntity<MemberInfoResponse> info(@RequestBody MemberInfoRequest request){
        String userEmail = jwtTokenProvider.getUserEmail(request.getAccessToken());

        Member member = memberService.getMemberInfoByUserName(userEmail);

        MemberInfoResponse memberInfoResponse = new MemberInfoResponse().fromEntity(member);
        int breakpoint = 0;
        return ResponseEntity.status(HttpStatus.OK).body(memberInfoResponse);
    }
}
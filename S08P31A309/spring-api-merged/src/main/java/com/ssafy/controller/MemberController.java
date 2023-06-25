package com.ssafy.controller;

import com.ssafy.dto.MemberInfoDto;
import com.ssafy.dto.MemberLoginDto;
import com.ssafy.dto.MemberSignUpDto;
import com.ssafy.dto.MemberInfoResponse;
import com.ssafy.dto.MemberDto;
import com.ssafy.entity.Member;
import com.ssafy.service.MemberService;
import com.ssafy.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/member")
public class MemberController {
    private final MemberService memberService;
    public static final String AUTHORIZATION_HEADER = "Authorization";
    private final JwtTokenProvider jwtTokenProvider;


    @PostMapping(value="/signup")
    public ResponseEntity<Void> signUp(@Validated @RequestBody MemberSignUpDto request){
        memberService.signUp(request);
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PostMapping(value = "/login")
    public ResponseEntity<MemberDto> login(@Validated @RequestBody MemberLoginDto request){
        MemberDto response = memberService.login(request);

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
    public ResponseEntity<MemberInfoResponse> info(@AuthenticationPrincipal UserDetails userDetails){
        String userEmail = userDetails.getUsername();
        Member member = memberService.getMemberInfoByUserName(userEmail);
        MemberInfoResponse memberInfoResponse = new MemberInfoResponse().fromEntity(member);
        return ResponseEntity.status(HttpStatus.OK).body(memberInfoResponse);
    }
}
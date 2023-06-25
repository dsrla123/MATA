package com.ssafy.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.dto.WebLogDto;
import com.ssafy.service.CassandraService;
import com.ssafy.service.InjectionService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class TagManagerController {

    private final CassandraService cassandraService;

    @PostMapping("/dump")
    public ResponseEntity<?> getLogDump(@RequestBody WebLogDto[] body) {

        cassandraService.checkValidation(body[0].getProjectToken()); // 토큰 검증 로직
        long project_id = cassandraService.getProjectId(body[0].getProjectToken()); // 토큰으로 서비 아이디 가져오기
        System.out.println(body[0].toString());
        System.out.println(body.length);
        List<WebLogDto> webLogDtoList = new ArrayList<>(Arrays.asList(body));

        try {
            cassandraService.sendToCassandra(webLogDtoList, project_id);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}

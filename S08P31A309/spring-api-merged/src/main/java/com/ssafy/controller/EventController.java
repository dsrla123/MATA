package com.ssafy.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.dto.WebLogDto;
import com.ssafy.service.CassandraService;
import com.ssafy.service.InjectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/js")
public class EventController {

    private final InjectionService injectionService;
    //private final KafkaProducerService kafkaProducerService;
    private final CassandraService cassandraService;
    private static final String SUCCESS = "success in EventController";
    private static final String FAIL = "fail in EventController";

    // 로그 수집 코드 주입 , 추후 토큰으로 바뀔 듯
    @GetMapping("/{projectToken}")
    public ResponseEntity<?> getJS(
            @PathVariable("projectToken") String projectToken) {
        String code = injectionService.callJsCode(projectToken);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/javascript")
                .body(code);
    }
    @GetMapping("/{projectToken}/config")
    public ResponseEntity<?> getInjection(
            @PathVariable("projectToken") String projectToken) {
        Map<String, Object> injection = injectionService.getInjection(projectToken);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(injection);
    }


    @GetMapping("/exampledata_webtojava")
    public ResponseEntity<?> dummyDataSetting() throws InterruptedException {

        List referlist = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            referlist.add("https://www.google.com/");
        }
        for (int i = 0; i < 100; i++) {
            referlist.add("https://www.naver.com/");
        }
        for (int i = 0; i < 100; i++) {
            referlist.add("https://www.daum.com/");
        }

        List<String> urlList = new ArrayList<>();
        // 10개
        urlList.add("/");
        urlList.add("/first");
        urlList.add("/second");
        urlList.add("/first/abcabc");
        urlList.add("/first/shop");
        urlList.add("/first/list");
        urlList.add("/second/qna");
        urlList.add("/second/board");
        urlList.add("/second/map");
        urlList.add("/journals");

        List<String> idList = new ArrayList<>();
        idList.add("button-back");
        idList.add("button-event");
        idList.add("map1");
        idList.add("map2");


        for (long k = 0; k < 15; k++) {
            Thread.sleep(1000);
            long projectId = 10 + k % 15;

            // 500명의 유저 접속, url 랜덤
            for (int i = 0; i < 500; i++) {
                List<WebLogDto> webLogDtoList = new ArrayList<>();
                // 10개의 event
                for (int j = 0; j < 20; j++) {
                    WebLogDto wl = new WebLogDto();
//                    wl.setProjectId(projectId);
                    int hashValue = (int) (Math.random() * 100000);
                    int hashValue2 = (int) (Math.random() * 5) + 1;

                    wl.setProjectToken("projectToken");
                    wl.setSessionId(String.valueOf(String.valueOf(hashValue).hashCode()));
                    long nowTime = System.currentTimeMillis();
                    long time = nowTime - nowTime % 30000000;

                    if(i % 5 == 0)       wl.setScreenDevice("Desktop");
                    else if(i % 5 == 1)  wl.setScreenDevice("tablet");
                    else                 wl.setScreenDevice("phone");

                    if(i % 13 == 0)      wl.setUserLanguage("ko");
                    else                 wl.setUserLanguage("en");

                    wl.setLocation("https://mata2.co.kr" + urlList.get(hashValue%10));
                    if(i % 5 == 0)  wl.setReferrer(referlist.get(i%300).toString());
                    else            wl.setReferrer("https://mata2.co.kr" + urlList.get((hashValue%10 + hashValue2 % 4) % 10));

                    long duTime = 10 + hashValue % 1000;
                    int hashValue3 = (int) (Math.random() * 100000);
                    wl.setTimestamp(time + hashValue * 300);
                    wl.setEvent("none");
                    wl.setData("{}");
                    if (j == 0) {
                        // pageenter
                        wl.setEvent("pageenter");
                        wl.setPageDuration(0);
                        wl.setPositionX(0);
                        wl.setPositionY(0);
                    } else if (j == 19) {
                        // pageleave
                        wl.setEvent("pageleave");
                        wl.setPageDuration(duTime * j);
                        wl.setPositionX(0);
                        wl.setPositionY(0);
                    } else {
                        // click
                        wl.setPageDuration(duTime * j);
                        wl.setPositionX(hashValue % 1000 + hashValue3 % 10);
                        wl.setPositionY(hashValue % 520 + hashValue3 % 10);
                        if (j > 15) {
                            wl.setTargetName("클릭 태그" + i % 3);
                            wl.setEvent("click");
                        } else if (j > 17) {
                            wl.setTargetName("로그인");
                            wl.setEvent("login");
                        } else {
                            wl.setTargetName("구매 클릭");
                            wl.setEvent("purchase");
                            if (j % 7 == 0) wl.setData("{}");
                            else if (i % 7 < 3) wl.setData("{id:" + i % 8 + "}");
                            else wl.setData("{item_id:" + i % 3 + "}");
                        }
                    }
                    webLogDtoList.add(wl);
                }
                try {
                    cassandraService.sendToCassandra(webLogDtoList, projectId);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
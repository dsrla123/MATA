package com.ssafy.controller;

import com.ssafy.entity.*;
import com.ssafy.service.HiveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {
    private final HiveService hiveService;
    private final List<String> validation = Arrays.asList("1m", "5m", "10m", "30m", "1h", "6h", "12h", "1d", "1w", "1mo", "6mo", "1y");
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getTest(@AuthenticationPrincipal UserDetails userDetails){
        List<Map<String, Object>> webLogs = hiveService.getWebLogs();
        return ResponseEntity.status(HttpStatus.OK).body(webLogs);
    }
    @GetMapping("/components")
    public ResponseEntity<?> getComponents(@RequestParam(name="basetime") long baseTime,
                                           @RequestParam(name="interval") String interval,
                                           @RequestParam(name="projectId") long projectId,
                                           @AuthenticationPrincipal UserDetails userDetails){
        if(!validation.contains(interval)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        List<HiveComponent> hiveComponents = hiveService.getComponents(baseTime, interval, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hiveComponents);
    }
    @GetMapping("/clicks")
    public ResponseEntity<List<HiveClick>> getClicks(@RequestParam(name="basetime") long baseTime,
                                                     @RequestParam(name="interval") String interval,
                                                     @RequestParam(name="projectId") long projectId,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        if(!validation.contains(interval)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        List<HiveClick> clicks = hiveService.getClicks(baseTime, interval, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(clicks);
    }
    @GetMapping("/durations")
    public ResponseEntity<List<HivePageDuration>> getPageDurations(@RequestParam(name="basetime") long baseTime,
                                                                   @RequestParam(name="interval") String interval,
                                                                   @RequestParam(name="projectId") long projectId,
                                                                   @AuthenticationPrincipal UserDetails userDetails) {
        if(!validation.contains(interval)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        List<HivePageDuration> hivePageDurations = hiveService.getPageDurations(baseTime, interval, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hivePageDurations);
    }
    @GetMapping("/journals")
    public ResponseEntity<List<HivePageJournal>> getPageJournals(@RequestParam(name="basetime") long baseTime,
                                                                 @RequestParam(name="interval") String interval,
                                                                 @RequestParam(name="projectId") long projectId,
                                                                 @AuthenticationPrincipal UserDetails userDetails) {
        if(!validation.contains(interval)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        List<HivePageJournal> hivePageJournals = hiveService.getPageJournals(baseTime, interval, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hivePageJournals);
    }
    @GetMapping("/refers")
    public ResponseEntity<List<HivePageRefer>> getPageRefers(@RequestParam(name="basetime") long baseTime,
                                                             @RequestParam(name="interval") String interval,
                                                             @RequestParam(name="projectId") long projectId,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        if(!validation.contains(interval)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        List<HivePageRefer> hivePageRefers = hiveService.getPageRefers(baseTime, interval, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hivePageRefers);
    }
    @GetMapping("/events")
    public ResponseEntity<List<HiveEvent>> getEvents(@RequestParam(name="basetime") long baseTime,
                                                             @RequestParam(name="interval") String interval,
                                                             @RequestParam(name="projectId") long projectId,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        if(!validation.contains(interval)) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        List<HiveEvent> hiveEvents = hiveService.getEvents(baseTime, interval, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hiveEvents);
    }

    // 누적 데이터 api
    @GetMapping("/components_all")
    public ResponseEntity<?> getComponents(@RequestParam(name="basetime") long baseTime,
                                           @RequestParam(name="projectId") long projectId,
                                           @AuthenticationPrincipal UserDetails userDetails){
        List<HiveComponent> hiveComponents = hiveService.getComponentsAll(baseTime, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hiveComponents);
    }
    @GetMapping("/clicks_all")
    public ResponseEntity<List<HiveClick>> getClicks(@RequestParam(name="basetime") long baseTime,
                                                     @RequestParam(name="projectId") long projectId,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        List<HiveClick> clicks = hiveService.getClicksAll(baseTime, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(clicks);
    }
    @GetMapping("/durations_all")
    public ResponseEntity<List<HivePageDuration>> getPageDurations(@RequestParam(name="basetime") long baseTime,
                                                                   @RequestParam(name="projectId") long projectId,
                                                                   @AuthenticationPrincipal UserDetails userDetails) {
        List<HivePageDuration> hivePageDurations = hiveService.getPageDurationsAll(baseTime, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hivePageDurations);
    }
    @GetMapping("/journals_all")
    public ResponseEntity<List<HivePageJournal>> getPageJournals(@RequestParam(name="basetime") long baseTime,
                                                                 @RequestParam(name="projectId") long projectId,
                                                                 @AuthenticationPrincipal UserDetails userDetails) {
        List<HivePageJournal> hivePageJournals = hiveService.getPageJournalsAll(baseTime, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hivePageJournals);
    }
    @GetMapping("/refers_all")
    public ResponseEntity<List<HivePageJournal>> getPageRefers(@RequestParam(name="basetime") long baseTime,
                                                             @RequestParam(name="projectId") long projectId,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        List<HivePageJournal> hivePageJournalList = hiveService.getPageRefersAll(baseTime, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hivePageJournalList);
    }
//    @GetMapping("/refers_all")
//    public ResponseEntity<List<HivePageRefer>> getPageRefers(@RequestParam(name="basetime") long baseTime,
//                                                             @RequestParam(name="projectId") long projectId,
//                                                             @AuthenticationPrincipal UserDetails userDetails) {
//        // 임시
//        baseTime = 1684025143516l;
//        List<HivePageRefer> hivePageRefers = hiveService.getPageRefersAll(baseTime, projectId);
//        return ResponseEntity.status(HttpStatus.OK).body(hivePageRefers);
//    }
    @GetMapping("/events_all")
    public ResponseEntity<List<HiveEvent>> getEvents(@RequestParam(name="basetime") long baseTime,
                                                     @RequestParam(name="projectId") long projectId,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        List<HiveEvent> hiveEvents = hiveService.getEventsAll(baseTime, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(hiveEvents);
    }



}

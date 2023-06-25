package com.ssafy.entity;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class HivePageDuration {

    private long totalDuration;
    private long totalSession;
    private String location;
    private String screenDevice;
    private String userLanguage;
    private Timestamp updateTimestamp;
    private long projectId;

}

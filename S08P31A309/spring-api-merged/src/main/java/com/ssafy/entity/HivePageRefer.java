package com.ssafy.entity;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class HivePageRefer {

    private long totalSession;
    private long totalPageenter;
    private String referrer;
    private String screenDevice;
    private String userLanguage;
    private Timestamp updateTimestamp;
    private long projectId;

}

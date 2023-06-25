package com.ssafy.entity;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class HivePageJournal {

    private long totalJournal;
    private String locationFrom;
    private String locationTo;
    private String screenDevice;
    private String userLanguage;
    private Timestamp updateTimestamp;
    private long projectId;

}

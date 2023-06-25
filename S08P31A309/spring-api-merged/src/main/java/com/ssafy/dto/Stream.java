package com.ssafy.dto;

import lombok.*;
import org.apache.hadoop.hive.common.type.Timestamp;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Table
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stream {

    @PrimaryKey
    private String key;
    private long project_id;
    private String session_id;
    private String event;
    private String target_id;
    private int position_x;
    private int position_y;
    private String location;
    private String referrer;
    private Instant creation_timestamp;
    private long page_duration;
    private String data;
    private String screen_device;
    private String target_name;
    private String title;
    private String user_agent;
    private String user_language;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Stream{");
        sb.append("key='").append(key).append('\'');
        sb.append(", project_id=").append(project_id);
        sb.append(", session_id='").append(session_id).append('\'');
        sb.append(", event='").append(event).append('\'');
        sb.append(", target_id='").append(target_id).append('\'');
        sb.append(", position_x=").append(position_x);
        sb.append(", position_y=").append(position_y);
        sb.append(", location='").append(location).append('\'');
        sb.append(", referrer='").append(referrer).append('\'');
        sb.append(", creation_timestamp=").append(creation_timestamp);
        sb.append(", page_duration=").append(page_duration);
        sb.append(", data='").append(data).append('\'');
        sb.append(", screen_device='").append(screen_device).append('\'');
        sb.append(", target_name='").append(target_name).append('\'');
        sb.append(", title='").append(title).append('\'');
        sb.append(", user_agent='").append(user_agent).append('\'');
        sb.append(", user_language='").append(user_language).append('\'');
        sb.append('}');
        return sb.toString();
    }

    public static Stream webLogFormChange(WebLogDto webLogDto, UUID key, long project_id) {
        return Stream.builder()
                .key(key.toString())
                .project_id(project_id)
                .session_id(webLogDto.getSessionId())
                .event(webLogDto.getEvent())
                .target_id(webLogDto.getTargetId())
                .position_x(webLogDto.getPositionX())
                .position_y(webLogDto.getPositionY())
                .location(webLogDto.getLocation())
                .referrer(webLogDto.getReferrer())
                .creation_timestamp(Instant.ofEpochSecond(webLogDto.getTimestamp()/1000))
                .page_duration(webLogDto.getPageDuration())
                .data(webLogDto.getData())
                .screen_device(webLogDto.getScreenDevice())
                .target_name(webLogDto.getTargetName())
                .title(webLogDto.getTitle())
                .user_agent(webLogDto.getUserAgent())
                .user_language(webLogDto.getUserLanguage())
                .build();
    }

}

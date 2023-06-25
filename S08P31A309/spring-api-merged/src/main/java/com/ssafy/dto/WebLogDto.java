package com.ssafy.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.entity.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.json.JSONObject;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebLogDto {

//    private long clientId;
//    private String prevLocation;
    private long projectId;
    private String projectToken;
    private String sessionId;
    private String event;
    private String targetId;
    private String targetName;
    private String title;
    private String location;
    private String referrer;
    private long timestamp;
    private long pageDuration;
    private String userAgent;
    private String data;
    private String userLanguage;
//    private int screenSizeX; //window.innerWidth
//    private int screenSizeY; //window.innerHeight
    private String screenDevice;
    private int positionX;
    private int positionY;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("WebLogDto{");
        sb.append("projectId=").append(projectId);
        sb.append(", projectToken='").append(projectToken).append('\'');
        sb.append(", sessionId='").append(sessionId).append('\'');
        sb.append(", event='").append(event).append('\'');
        sb.append(", targetId='").append(targetId).append('\'');
        sb.append(", targetName='").append(targetName).append('\'');
        sb.append(", title='").append(title).append('\'');
        sb.append(", location='").append(location).append('\'');
        sb.append(", referrer='").append(referrer).append('\'');
        sb.append(", timestamp=").append(timestamp);
        sb.append(", pageDuration=").append(pageDuration);
        sb.append(", userAgent='").append(userAgent).append('\'');
        sb.append(", data='").append(data).append('\'');
        sb.append(", userLanguage='").append(userLanguage).append('\'');
//        sb.append(", screenSizeX=").append(screenSizeX);
//        sb.append(", screenSizeY=").append(screenSizeY);
        sb.append(", screenDevice=").append(screenDevice);
        sb.append(", positionX=").append(positionX);
        sb.append(", positionY=").append(positionY);
        sb.append('}');
        return sb.toString();
    }

    public ProducerRecord<String, String> toProducerRecord(String topic, Integer partition) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
//         this.clientId = 1L;
//         this.projectId = 2L;
        return new ProducerRecord<>(topic, partition, this.timestamp, this.sessionId+"-"+this.timestamp, mapper.writeValueAsString(this));
    }

}

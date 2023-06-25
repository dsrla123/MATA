package com.ssafy.dto;

import com.ssafy.entity.Event;
import com.ssafy.entity.EventParam;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaveEventParamDto {
    private String paramName;
    private String paramKey;
    public EventParam toEntity(Event event){
//        return new EventParam(id, paramName, paramKey, eventDto.toEntity());
        return EventParam.builder()
                .paramName(paramName)
                .paramKey(paramKey)
                .event(event)
                .build();
    }
}

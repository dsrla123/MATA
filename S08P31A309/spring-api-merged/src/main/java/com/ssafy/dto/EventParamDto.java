package com.ssafy.dto;

import com.ssafy.entity.EventParam;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class EventParamDto {
//    private Long id;
    private String paramName;
    private String paramKey;
//    private EventDto eventDto;

    public static EventParamDto toDto(EventParam eventParam){
        return EventParamDto.builder()
                .paramName(eventParam.getParamName())
                .paramKey(eventParam.getParamKey())
                .build();
//        return new EventParamDto(
//                eventParam.getId(),
//                eventParam.getParamName(),
//                eventParam.getParamKey(),
//                EventDto.toDto(eventParam.getEvent())
//        );
    }
//    public EventParam toEntity(){
//
////        return new EventParam(id, paramName, paramKey, eventDto.toEntity());
//        return EventParam.builder()
//                .paramName(paramName)
//                .paramKey(paramKey)
//                .build();
//    }
}

package com.ssafy.dto;

import com.ssafy.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class EventDto {
//    private Long id;
    private String eventName;
    private String eventBase;
    private List<EventParamDto> eventParamDtoList;
    private List<EventPathDto> eventPathDtoList;
//    private Project project;


//    public static EventDto toDto(Event event) {
//        //entity 리스트에서 dto 리스트로
//        List<EventParam> fromEventParamList = event.getEventParamList();
//        List<EventPath> fromEventPathList = event.getEventPathList();
//
//        List<EventParamDto> toEventParamDtoList = new ArrayList<>();
//        List<EventPathDto> toEventPathDtoList = new ArrayList<>();
//
//        for (int i = 0; i < fromEventParamList.size(); i++) {
//            toEventParamDtoList.add(EventParamDto.toDto(fromEventParamList.get(i)));
//        }
//        for (int i = 0; i < fromEventPathList.size(); i++) {
//            toEventPathDtoList.add(EventPathDto.toDto(fromEventPathList.get(i)));
//        }
//        //여기까지
//        return new EventDto(
//                event.getId(),
//                event.getEventName(),
//                event.getEventBase(),
//                toEventParamDtoList,
//                toEventPathDtoList,
//                event.getProject()
//        );
//    }
//
//    public Event toEntity() {
//        List<EventParam> toParam = new ArrayList<>();
//        List<EventPath> toPath = new ArrayList<>();
//        for (int i = 0; i < eventParamDtoList.size(); i++) {
//            toParam.add(eventParamDtoList.get(i).toEntity());
//        }
//        for (int i = 0; i < eventPathDtoList.size(); i++) {
//            toPath.add(eventPathDtoList.get(i).toEntity());
//        }
//        return Event.builder()
//                .id(id)
//                .eventName(eventName)
//                .eventBase(eventBase)
//                .eventParamList(toParam)
//                .eventPathList(toPath)
//                .project(project)
//                .build();
//    }

    public static List<EventDto> toDtoList(List<Event> eventList) {
        List<EventDto> eventDtoList = new ArrayList<>();

        for (Event e : eventList) {
            List<EventParam> fromEventParamList = e.getEventParamList();
            List<EventPath> fromEventPathList = e.getEventPathList();

            List<EventParamDto> toEventParamDtoList = new ArrayList<>();
            List<EventPathDto> toEventPathDtoList = new ArrayList<>();

            for (int i = 0; i < fromEventParamList.size(); i++) {
                EventParam eventParam = fromEventParamList.get(i);
                if(!eventParam.isEnabled()) continue;
                toEventParamDtoList.add(EventParamDto.toDto(eventParam));
            }
            for (int i = 0; i < fromEventPathList.size(); i++) {
                EventPath eventPath = fromEventPathList.get(i);
                if(!eventPath.isEnabled()) continue;
                toEventPathDtoList.add(EventPathDto.toDto(fromEventPathList.get(i)));
            }

//            eventDtoList.add(new EventDto(
//                    e.getId(),
//                    e.getEventName(),
//                    e.getEventBase(),
//                    toEventParamDtoList,
//                    toEventPathDtoList,
//                    e.getProject()
//            ));
            eventDtoList.add(EventDto.builder()
                    .eventName(e.getEventName())
                    .eventBase(e.getEventBase())
                    .eventParamDtoList(toEventParamDtoList)
                    .eventPathDtoList(toEventPathDtoList)
                    .build());
        }

        return eventDtoList;
    }
}

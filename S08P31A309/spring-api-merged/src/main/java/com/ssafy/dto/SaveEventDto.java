package com.ssafy.dto;

import com.ssafy.entity.Event;
import com.ssafy.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaveEventDto {

    private String eventName;
    private String eventBase;
    private List<SaveEventParamDto> eventParam;
    private List<SaveEventPathDto> eventPath;

    public Event toEntity(Project project) {
        return Event.builder()
                .eventName(eventName)
                .eventBase(eventBase)
                .project(project)
                .build();
    }
}
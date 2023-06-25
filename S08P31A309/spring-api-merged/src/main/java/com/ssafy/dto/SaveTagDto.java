package com.ssafy.dto;

import com.ssafy.entity.Project;
import com.ssafy.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SaveTagDto {

    private String tagName;
    private String tagId;
    private String tagClass;
    private List<String> tagEvents;

    public Tag toTagEntity(Project project) {
        return Tag.builder()
                .htmlTagName(tagName)
                .htmlTagId(tagId)
                .htmlTagClass(tagClass)
                .project(project)
                .build();
    }

}

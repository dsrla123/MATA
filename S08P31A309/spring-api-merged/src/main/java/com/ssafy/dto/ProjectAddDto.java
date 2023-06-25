package com.ssafy.dto;

import com.ssafy.entity.Member;
import com.ssafy.entity.Project;
import com.ssafy.util.ProjectCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAddDto {

    private String url;
    private String name;
    private ProjectCategory category;


    public Project toEntity(Member member) {
        Project project = Project.builder()
                .category(category)
                .url(url)
                .member(member)
                .name(name)
                .build();
        project.updateToken();
        return project;
    }
}


package com.ssafy.entity;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@DynamicInsert
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
public class Tag {

    @Id @Column(name = "tagId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    private String htmlTagName;

    @Size(max = 255)
    private String htmlTagId;

    @Size(max = 255)
    private String htmlTagClass;

    @OneToMany(mappedBy = "tag")
    private List<TagEvent> tagEventList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Builder.Default
    private boolean isEnabled = true;
}


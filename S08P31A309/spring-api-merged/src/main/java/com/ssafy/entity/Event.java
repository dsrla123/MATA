package com.ssafy.entity;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;
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
public class Event {

    @Id @Column(name = "eventId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    private String eventName;

    @Size(max = 255)
    private String eventBase;

    @OneToMany(mappedBy = "event")
    private List<TagEvent> tagEventList = new ArrayList<>();

    @OneToMany(mappedBy = "event")
    private List<EventParam> eventParamList = new ArrayList<>();

    @OneToMany(mappedBy = "event")
    private List<EventPath> eventPathList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Builder.Default
    private boolean isEnabled = true;
}


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
public class EventParam {

    @Id @Column(name = "eventParamId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    private String paramName;

    @Size(max = 255)
    private String paramKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;
    @Builder.Default
    private boolean isEnabled = true;

}



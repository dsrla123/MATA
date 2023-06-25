package com.ssafy.entity;

import com.ssafy.util.ProjectCategory;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@DynamicInsert
@AllArgsConstructor
@Getter
@Entity
@Builder
@NoArgsConstructor
public class Project {

    @Id @Column(name = "projectId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    @NotNull
    private String url;

    @Size(max = 20)
    @NotNull
    private String name;

    @CreationTimestamp
    private LocalDateTime createAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    @Size(max = 255)
    @ColumnDefault("null")
    private String token;

    @ColumnDefault("false")
    private boolean isQuit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "project")
    private List<Tag> tagList = new ArrayList<>();

    @OneToMany(mappedBy = "project")
    private List<Event> eventList = new ArrayList<>();

    @ColumnDefault("false")
    private boolean isSpa;

    public void updateToken(){
        UUID uuid = UUID.randomUUID();
        this.token = uuid.toString();
    }

    public void deleteToken(){
        this.token = null;
    }
}

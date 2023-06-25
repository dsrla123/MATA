package com.ssafy.repository;

import com.ssafy.entity.Project;
import com.ssafy.entity.TagEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagEventRepository extends JpaRepository<TagEvent, Long> {
    List<TagEvent> findAllByTagId(long tagId);
    List<TagEvent> findAllByTagIdAndIsEnabledIsTrue(long tagId);
    Optional<TagEvent> findByTagIdAndEventId(long tagId, long eventId);
    Optional<TagEvent> findByTagIdAndEventIdAndIsEnabledIsTrue(long tagId, long eventId);
}

package com.ssafy.repository;

import com.ssafy.entity.EventPath;
import com.ssafy.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventPathRepository extends JpaRepository<EventPath, Long> {
    List<EventPath> findAllByEventId(long eventId);
    Optional<EventPath> findByPathIndexAndPathNameAndEvent_IdAndEvent_IsEnabledIsTrue(String pathIndex, String pathName, long eventId);
}

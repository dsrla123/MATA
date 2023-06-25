package com.ssafy.repository;

import com.ssafy.entity.EventParam;
import com.ssafy.entity.EventPath;
import com.ssafy.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParamRepository extends JpaRepository<EventParam, Long> {
    List<EventParam> findAllByEventId(long eventId);
    Optional<EventParam> findByParamNameAndParamKeyAndEvent_IdAndEvent_IsEnabledIsTrue(String paramName, String paramKey, long eventId);
}

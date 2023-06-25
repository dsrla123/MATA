package com.ssafy.repository;

import com.ssafy.entity.Project;
import com.ssafy.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
//    Optional<Tag> findById(long tagId);
    List<Tag> findAllByProjectId(long projectId);
    List<Tag> findAllByProjectIdAndIsEnabledIsTrue(long projectId);
    Optional<Tag> findByHtmlTagIdAndProjectId(String htmlTagId, long projectId);
    Optional<Tag> findByHtmlTagNameAndProjectIdAndIsEnabledIsTrue(String htmlTagName, long projectId);
}

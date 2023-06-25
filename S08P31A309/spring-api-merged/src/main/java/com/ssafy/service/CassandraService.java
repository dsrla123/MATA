package com.ssafy.service;

import com.datastax.oss.driver.api.core.uuid.Uuids;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.dto.Stream;
import com.ssafy.dto.WebLogDto;
import com.ssafy.entity.Project;
import com.ssafy.repository.ProjectRepository;
import com.ssafy.repository.WeblogRepository;
import com.ssafy.util.RedisKeyExecption;
import com.ssafy.util.Validation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CassandraService {

    @Value(value = "${spring.data.cassandra.keyspace-name}")
    private String TAG_MANAGER_KEYSPACE;
//    private final CassandraTemplate cassandraTemplate;
    private final Validation validation;
    private final ProjectRepository projectRepository;
    private final StringRedisTemplate redisTemplate;
    private final WeblogRepository weblogRepository;

    @Transactional
    public void sendToCassandra(List<WebLogDto> webLogDtoList, long project_id) throws JsonProcessingException {
        List<Stream> streamList = webLogDtoList.stream()
                .map(webLogDto -> Stream.webLogFormChange(webLogDto, Uuids.timeBased(), project_id))
                .collect(Collectors.toList());
        weblogRepository.saveAll(streamList);
    }


    @Transactional(readOnly = true)
    public void checkValidation(String token){
        if(!validation.checkRedisValidation(token)){
            Project project = projectRepository.findByToken(token).orElseThrow(RedisKeyExecption::new);
        };
    }

    @Transactional(readOnly = true)
    public Long getProjectId(String token){
        String id = redisTemplate.opsForValue().get(token);
        if(id == null){
            Project project = projectRepository.findByToken(token).orElseThrow(RedisKeyExecption::new);
            return project.getId();
        }
        return Long.parseLong(id);
    }
}

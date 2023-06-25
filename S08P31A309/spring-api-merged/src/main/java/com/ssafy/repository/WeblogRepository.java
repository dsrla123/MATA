package com.ssafy.repository;

import java.util.UUID;

import com.ssafy.dto.Stream;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeblogRepository extends CassandraRepository<Stream, UUID> {

}

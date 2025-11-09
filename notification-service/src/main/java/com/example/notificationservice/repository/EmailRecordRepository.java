package com.example.notificationservice.repository;

import com.example.notificationservice.model.EmailRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRecordRepository extends MongoRepository<EmailRecord, String> {
}

package com.lostandfound.repository;

import com.lostandfound.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByName(String name);
}

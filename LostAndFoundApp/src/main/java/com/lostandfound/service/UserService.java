package com.lostandfound.service;

import com.lostandfound.model.User;
import com.lostandfound.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public void saveNewUser(User user){
        try{
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(Arrays.asList("USER"));
            userRepository.save(user);
        }catch(Exception e) {
            log.error("Error occured for {}", user.getName(), e); // Use of slf4j for logging
        }
    }

    public User deleteUser(String id){
        User userToRemove = userRepository.findById(id).orElse(null);

        if(userToRemove != null) {
            userRepository.deleteById(id);
        }
        return userToRemove;
    }

    public User findByName(String name) {
        return userRepository.findByName(name);
    }
}

package com.lostandfound.controller;

import com.lostandfound.config.SpringSecurity;
import com.lostandfound.model.User;
import com.lostandfound.repository.UserRepository;
import com.lostandfound.service.LostItemService;
import com.lostandfound.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private LostItemService lostItemService;

    @GetMapping
    public List<User> getAllUser(){
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public User getMyInfo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return userService.findByName(username);
    }

    // Delete items listed by the user
    @DeleteMapping("/delete-user")
    public User deleteUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();

        User user = userService.findByName(name);
        String id = user.getId();

        // Deleting uploaded items by the user
        user.getReportedItems().forEach(x -> lostItemService.deleteItem(x.getId(), name));

        return userService.deleteUser(id);
    }
}

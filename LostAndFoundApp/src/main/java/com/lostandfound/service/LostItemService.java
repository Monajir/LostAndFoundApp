package com.lostandfound.service;

import com.lostandfound.model.LostItem;
import com.lostandfound.model.User;
import com.lostandfound.repository.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LostItemService {

    @Autowired
    private UserService userService;

    @Autowired
    private LostItemRepository lostItemRepository;

    // Could add transactional
    public LostItem saveNewItem(LostItem item, String name){
        try{
            User user = userService.findByName(name);
            item.setDateFound(LocalDateTime.now());
            lostItemRepository.save(item);
            user.getReportedItems().add(item);
            userService.saveUser(user);
            return item;
        }catch(Exception e) {
            throw new RuntimeException("An error has occurred while saving journal or user", e);
        }
    }

    public void saveItem(LostItem item){
        lostItemRepository.save(item);
    }

    public List<LostItem> showAllItems(){
        return lostItemRepository.findAll();
    }

    public Optional<LostItem> findById(String id) {
        return lostItemRepository.findById(id);
    }

    // Could make it transactional
    public void deleteItem(String id, String name){
        boolean removed = false;
        try{
            User user = userService.findByName(name);
            removed = user.getReportedItems().removeIf(x -> x.getId().equals(id));
            if(removed){
                userService.saveUser(user);
                lostItemRepository.deleteById(id);
            }
        }catch(Exception e){
            throw new RuntimeException("An error occured while deleting the entry", e);
        }

    }

    public List<LostItem> findByIgnoreCase(String query){
        return lostItemRepository.findByItemNameContainingIgnoreCase(query);
    }

    public List<LostItem> findByCategory(String category){
        return lostItemRepository.findByCategory(category);
    }

    public List<LostItem> findByNameAndCategory(String name, String category) {
        // Category and case-sensitive substring of Name
        return lostItemRepository.findByItemNameContainingIgnoreCaseAndCategory(name, category);
    }
}

package com.lostandfound.controller;

import com.lostandfound.model.LostItem;
import com.lostandfound.model.User;
import com.lostandfound.repository.LostItemRepository;
import com.lostandfound.service.LostItemService;
import com.lostandfound.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class LostItemController {

    @Autowired
    private UserService userService;

    @Autowired
    private LostItemService lostItemService;

    @GetMapping
    public List<LostItem> getAllItems() {
        return lostItemService.showAllItems();
    }

    @PostMapping("/add")
    public LostItem createItem(@RequestBody LostItem item) {
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            lostItemService.saveNewItem(item, username);
            return item;
        }catch(Exception e){
            return null;
        }
    }

    @GetMapping("/id/{id}")
    public LostItem getItemById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByName(username);
//        LostItem item = lostItemService.findById(id).orElse(null);
        List<LostItem> item = user.getReportedItems().stream().filter(x -> x.getId().equals(id)).toList();
        if(item != null) {
            return item.get(0);
        }
        return null;
    }

    @PutMapping("/id/{id}")
    public LostItem updateItem(@PathVariable String id, @RequestBody LostItem item) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByName(username);

        List<LostItem> items = user.getReportedItems().stream().filter(x -> x.getId().equals(id)).toList();
        LostItem itemToChange = items.get(0);

        if(itemToChange != null){
            itemToChange.setItemName((item.getItemName() != null && !item.getItemName().isEmpty()) ? item.getItemName() : itemToChange.getItemName());
            itemToChange.setDescription((item.getDescription() != null && !item.getDescription().isEmpty()) ? item.getDescription() : itemToChange.getDescription());
            itemToChange.setCategory((item.getCategory() != null && !item.getCategory().isEmpty()) ? item.getCategory() : itemToChange.getCategory());
            itemToChange.setLocation((item.getLocation() != null && !item.getLocation().isEmpty()) ? item.getLocation() : itemToChange.getLocation());
            itemToChange.setStatus((item.getStatus() != null && !item.getStatus().isEmpty()) ? item.getStatus() : itemToChange.getStatus());
            itemToChange.setFinderName((item.getFinderName() != null && !item.getFinderName().isEmpty()) ? item.getFinderName() : itemToChange.getFinderName());
            itemToChange.setFinderContact((item.getFinderContact() != null && !item.getFinderContact().isEmpty()) ? item.getFinderContact() : itemToChange.getFinderContact());
            itemToChange.setImageUrl((item.getImageUrl() != null && !item.getImageUrl().isEmpty()) ? item.getImageUrl() : itemToChange.getImageUrl());

            lostItemService.saveItem(itemToChange);

            return itemToChange;
        }
        return null;
    }

    @DeleteMapping("/delete/id/{id}")
    public void deleteItem(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        lostItemService.deleteItem(id, username);

    }

    @GetMapping("/search")
    public List<LostItem> searchItems(@RequestParam(required = false, defaultValue = "") String query,
                                      @RequestParam(required = false, defaultValue = "all") String category
                                      ) {
        if(category.equals("all"))
            return lostItemService.findByIgnoreCase(query);
        else if (query.isEmpty()) {
            return lostItemService.findByCategory(category);
        } else{
            return lostItemService.findByNameAndCategory(query, category);
        }
    }

    // Redundant
    @GetMapping("/category/{category}")
    public List<LostItem> getItemsByCategory(@PathVariable String category) {
        return lostItemService.findByCategory(category);
    }
}
package com.lostandfound.repository;

import com.lostandfound.model.LostItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LostItemRepository extends MongoRepository<LostItem, String> {
    List<LostItem> findByStatus(String status);
    List<LostItem> findByCategory(String category);
    List<LostItem> findByItemNameContainingIgnoreCase(String itemName);
    List<LostItem> findByItemNameContainingIgnoreCaseAndCategory(String itemName, String category);
}

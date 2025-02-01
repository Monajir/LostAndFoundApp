package com.lostandfound.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "lost_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LostItem {
    @Id
    private String id;
    private String itemName;
    private String description;
    private String category;
    private String location;
    private LocalDateTime dateFound;
    private String status; // FOUND, CLAIMED, RETURNED
    private String finderName;
    private String finderContact;
    private String imageUrl;
}

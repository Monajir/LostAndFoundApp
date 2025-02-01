import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css'; 

function ItemList() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [expandedItemId, setExpandedItemId] = useState(null); 

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/items/search?query=${searchQuery}&category=${category}`
      );
      setItems(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  const toggleExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId); 
  };

  return (
    <div className="item-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="documents">Documents</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="items-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`item-card ${expandedItemId === item.id ? 'expanded' : ''}`}
            onClick={() => toggleExpand(item.id)}
          >
            <img src={item.imageUrl || '/placeholder.png'} alt={item.itemName} />
            <h3>{item.itemName}</h3>
            <p>{item.description}</p>
            <p>Location: {item.location}</p>
            <p>Status: {item.status}</p>

            {/* Expanded content */}
            {expandedItemId === item.id && (
              <div className="expanded-content">
                <p>Finder: {item.finderName}</p>
                <p>Contact: {item.finderContact}</p>
                <p>Date Found: {new Date(item.dateFound).toLocaleDateString()}</p>
                <p>Category: {item.category}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddItem() {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    itemName: '',
    description: '',
    category: '',
    location: '',
    finderName: '',
    finderContact: '',
    imageUrl: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/items/add', {
        ...item,
        dateFound: new Date(),
        status: 'FOUND'
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  
  return (
    <div className="add-item">
      <h2>Report Found Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={item.itemName}
          onChange={(e) => setItem({...item, itemName: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={item.description}
          onChange={(e) => setItem({...item, description: e.target.value})}
        />
        <select
          value={item.category}
          onChange={(e) => setItem({...item, category: e.target.value})}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="documents">Documents</option>
        </select>
        <input
          type="text"
          placeholder="Location Found"
          value={item.location}
          onChange={(e) => setItem({...item, location: e.target.value})}
        />
        <input
          type="text"
          placeholder="Your Name"
          value={item.finderName}
          onChange={(e) => setItem({...item, finderName: e.target.value})}
        />
        <input
          type="text"
          placeholder="Contact Information"
          value={item.finderContact}
          onChange={(e) => setItem({...item, finderContact: e.target.value})}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={item.imageUrl}
          onChange={(e) => setItem({...item, imageUrl: e.target.value})}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddItem;
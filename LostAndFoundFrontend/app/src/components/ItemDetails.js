import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemDetails.css'

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/items/id/${id}`);
      console.log("Found response without any error");
      setItem(response.data);
      setEditedItem(response.data);
      setError(null);
    } catch (err) {
      console.error('Error details:', err.response || err);
      if (err.response?.status === 400) {
        setError('Invalid item ID format');
      } else if (err.response?.status === 404) {
        setError('Item not found');
      } else {
        setError(`Error: ${err.response?.data || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8081/api/items/id/${id}`, editedItem);
      setItem(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating:', err.response || err);
      setError(`Error updating item: ${err.response?.data || err.message}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8081/api/items/delete/id/${id}`);
        navigate('/profile');
      } catch (err) {
        console.error('Error deleting:', err.response || err);
        setError(`Error deleting item: ${err.response?.data || err.message}`);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!item) return <div className="not-found">Item not found</div>;

  return (
    <div className="item-details">
      <h2>Item Details</h2>
      
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedItem.itemName}
            onChange={(e) => setEditedItem({...editedItem, itemName: e.target.value})}
            placeholder="Item Name"
          />
          <textarea
            value={editedItem.description}
            onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
            placeholder="Description"
          />
          <input
            type="text"
            value={editedItem.location}
            onChange={(e) => setEditedItem({...editedItem, location: e.target.value})}
            placeholder="Location"
          />
          <select
            value={editedItem.category}
            onChange={(e) => setEditedItem({...editedItem, category: e.target.value})}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="documents">Documents</option>
          </select>
          <select
            value={editedItem.status}
            onChange={(e) => setEditedItem({...editedItem, status: e.target.value})}
          >
            <option value="FOUND">Found</option>
            <option value="CLAIMED">Claimed</option>
            <option value="RETURNED">Returned</option>
          </select>
          <div className="button-group">
            <button onClick={handleUpdate}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="item-info">
          <img 
            src={item.imageUrl || '/placeholder.png'} 
            alt={item.itemName}
            className="item-image"
          />
          <div className="info-grid">
            <div>
              <h3>Name</h3>
              <p>{item.itemName}</p>
            </div>
            <div>
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>
            <div>
              <h3>Category</h3>
              <p>{item.category}</p>
            </div>
            <div>
              <h3>Location Found</h3>
              <p>{item.location}</p>
            </div>
            <div>
              <h3>Status</h3>
              <p>{item.status}</p>
            </div>
            <div>
              <h3>Found By</h3>
              <p>{item.finderName}</p>
            </div>
            <div>
              <h3>Contact</h3>
              <p>{item.finderContact}</p>
            </div>
            <div>
              <h3>Date Found</h3>
              <p>{item.dateFound ? new Date(item.dateFound).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          
          <div className="button-group">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} className="delete-button">Delete</button>
            <button onClick={() => navigate('/profile')}>Back to Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;